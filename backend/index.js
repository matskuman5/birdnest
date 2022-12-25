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
  axios.get(`${apiUrl}/pilots/${serialNumber}`).then((pilot) => {
    const violator = {
      ...pilot.data,
      serialNumber: serialNumber,
      violationTime: Date.now(),
      closestViolation: distance,
    };
    const oldViolator = violators.find((p) => p.serialNumber === serialNumber);
    if (oldViolator === undefined) {
      console.log('busted! new violator:', serialNumber, distance);
      violators.push(violator);
    } else {
      // if the violator already exists, update his violation time
      // and closest violation, if necessary
      console.log('updating violator:', serialNumber, distance);
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
    const keep = currentTime - violationTime < 1000 * 60 * 10;
    if (!keep) console.log('deleting old violation', violator.serialNumber);
    return keep;
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
    console.log('drones detected:', drones.length);

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
