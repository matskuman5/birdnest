const express = require('express');
const axios = require('axios');
const convertxml = require('xml-js');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static('build'));

var violators = [];
var drones = [];
var snapshotTimestamp = 0;

const addViolator = (serialNumber, distance) => {
  console.log('busted!', serialNumber, distance);
  axios
    .get(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`)
    .then((pilot) => {
      const violator = {
        firstName: pilot.data.firstName,
        lastName: pilot.data.lastName,
        phoneNumber: pilot.data.phoneNumber,
        email: pilot.data.email,
        serialNumber: serialNumber,
        violationTime: Date.now(),
        closestViolation: distance,
      };
      const oldViolator = violators.find(
        (p) => p.serialNumber === serialNumber
      );
      if (oldViolator === undefined) {
        violators.push(violator);
      } else {
        console.log('updating violator');
        if (violator.closestViolation > oldViolator.closestViolation) {
          violator.closestViolation = oldViolator.closestViolation;
        }
        violators = violators.map((eviolator) => {
          if (eviolator.serialNumber === violator.serialNumber) {
            return violator;
          }
          return {
            ...eviolator,
          };
        });
      }
    });
};

setInterval(() => {
  violators = violators.filter((violator) => {
    const currentTime = Date.now();
    const violationTime = new Date(violator.violationTime);
    return currentTime - violationTime < 1000 * 60 * 10;
  });

  axios.get('https://assignments.reaktor.com/birdnest/drones').then((xml) => {
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

app.get('/drones', (req, res) => {
  res.send({
    drones: drones,
    snapshotTimestamp: snapshotTimestamp,
  });
});

app.get('/violators', (req, res) => {
  res.send(violators);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
