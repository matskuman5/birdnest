const express = require('express');
const axios = require('axios');
const convertxml = require('xml-js');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static('build'));

const apiUrl = 'https://assignments.reaktor.com/birdnest';

var violators = [];
var drones = [];
var snapshotTimestamp = 0;

// adds or updates a violator
const addViolator = (serialNumber, distance) => {
  console.log('busted!', serialNumber, distance);
  axios.get(`${apiUrl}/pilots/${serialNumber}`).then((pilot) => {
    const violator = {
      ...pilot.data,
      serialNumber: serialNumber,
      violationTime: Date.now(),
      closestViolation: distance,
    };
    const oldViolator = violators.find((p) => p.serialNumber === serialNumber);
    if (oldViolator === undefined) {
      violators.push(violator);
    } else {
      // if the violator already exists, update his violation time
      // and closest violation, if necessary
      console.log('updating violator');
      if (violator.closestViolation > oldViolator.closestViolation) {
        violator.closestViolation = oldViolator.closestViolation;
      }
      violators = violators.map((existingViolator) => {
        if (existingViolator.serialNumber === violator.serialNumber) {
          return violator;
        }
        return {
          ...existingViolator,
        };
      });
    }
  });
};

// main loop, runs every 2 seconds
setInterval(() => {
  // remove violators older than 10 minutes
  violators = violators.filter((violator) => {
    const currentTime = Date.now();
    const violationTime = new Date(violator.violationTime);
    return currentTime - violationTime < 1000 * 60 * 10;
  });

  // get drone locations from API
  axios.get(`${apiUrl}/drones`).then((xml) => {
    const data = JSON.parse(convertxml.xml2json(xml.data));
    const droneData = data.elements[0].elements[1];
    const dronesAPI = droneData.elements.map((d) => {
      const drone = {
        serialNumber: d.elements[0].elements[0].text,
        positionY: parseFloat(d.elements[7].elements[0].text),
        positionX: parseFloat(d.elements[8].elements[0].text),
      };
      return drone;
    });
    snapshotTimestamp = droneData.attributes.snapshotTimestamp;
    drones = dronesAPI;
    console.log('droneslocal:', drones.length);

    // check for violators
    // violation = drone distance to nest at (250000, 250000) < 100 m
    drones.forEach((drone) => {
      const distance = Math.sqrt(
        (drone.positionX - 250000) ** 2 + (drone.positionY - 250000) ** 2
      );
      if (distance < 100000) {
        addViolator(drone.serialNumber, distance);
      }
    });
  });
}, 2000);

app.get('/data', (req, res) => {
  res.send({
    drones: drones,
    violators: violators,
    snapshotTimestamp: snapshotTimestamp,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
