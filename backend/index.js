require('dotenv').config();

const express = require('express');
const axios = require('axios');
const convertxml = require('xml-js');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.static('build'));
const jsonParser = bodyParser.json();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI);

const violatorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: String,
  serialNumber: String,
  violationTime: Number,
  closestViolation: Number,
});

const Violator = mongoose.model('Violator', violatorSchema);

var violatorslocal = [];
var droneslocal = [];
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
      const oldViolator = violatorslocal.find(
        (p) => p.serialNumber === serialNumber
      );
      if (oldViolator === undefined) {
        violatorslocal.push(violator);
        //save violator data in mongodb
        const violatordb = new Violator(violator);
        violatordb.save();
      } else {
        console.log('updating violator');
        if (violator.closestViolation > oldViolator.closestViolation) {
          violator.closestViolation = oldViolator.closestViolation;
        }
        violatorslocal.map((eviolator) => {
          if (eviolator.serialNumber === violator.serialNumber) {
            return violator;
          }
          return {
            ...eviolator,
          };
        });
        Violator.updateOne(
          { serialNumber: violator.serialNumber },
          {
            violationTime: violator.violationTime,
            closestViolation: violator.closestViolation,
          }
        );
      }
    });
};

setInterval(() => {
  Violator.find({}).then((violators) => {
    violatorslocals = violators;
    console.log('amount of violators: ', violatorslocal.length);
  });
  axios.get('https://assignments.reaktor.com/birdnest/drones').then((xml) => {
    const data = JSON.parse(convertxml.xml2json(xml.data));
    const droneData = data.elements[0].elements[1];
    const drones = droneData.elements.map((d) => {
      const drone = {
        serialNumber: d.elements[0].elements[0].text,
        model: d.elements[1].elements[0].text,
        manufacturer: d.elements[2].elements[0].text,
        mac: d.elements[3].elements[0].text,
        ipv4: d.elements[4].elements[0].text,
        ipv6: d.elements[5].elements[0].text,
        firmware: d.elements[6].elements[0].text,
        positionY: parseFloat(d.elements[7].elements[0].text),
        positionX: parseFloat(d.elements[8].elements[0].text),
        altitude: parseFloat(d.elements[9].elements[0].text),
      };
      return drone;
    });
    snapshotTimestamp = droneData.attributes.snapshotTimestamp;
    droneslocal = drones;
    console.log('droneslocal:', droneslocal.length);
    droneslocal.forEach((drone) => {
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
    drones: droneslocal,
    snapshotTimestamp: snapshotTimestamp,
  });
});

app.get('/deviceInformation', (req, res) => {
  axios.get('https://assignments.reaktor.com/birdnest/drones').then((xml) => {
    const data = JSON.parse(convertxml.xml2json(xml.data));
    const deviceData = data.elements[0].elements[0];
    const device = {
      deviceId: deviceData.attributes.deviceId,
      listenRange: deviceData.elements[0].elements[0].text,
      deviceStarted: deviceData.elements[1].elements[0].text,
      uptimeSeconds: deviceData.elements[2].elements[0].text,
      updateIntervalMs: deviceData.elements[3].elements[0].text,
    };
    res.send(device);
  });
});

app.get('/pilots/:serialNumber', (req, res) => {
  axios
    .get(
      `https://assignments.reaktor.com/birdnest/pilots/${req.params.serialNumber}`
    )
    .then((pilots) => {
      res.send(pilots.data);
    });
});

app.get('/violators', (req, res) => {
  res.send(violatorslocal);
});

app.post('/violators/:serialNumber', jsonParser, (req, res) => {
  const violator = new Violator(req.body);
  violator.save().then((savedViolator) => {
    res.json(savedViolator);
  });
});

app.put('/violators/:serialNumber', jsonParser, (req, res) => {
  Violator.updateOne(
    { serialNumber: req.params.serialNumber },
    {
      violationTime: req.body.violationTime,
      closestViolation: req.body.closestViolation,
    }
  ).then((update) => {
    res.send(update);
  });
});

app.delete('/violators/:serialNumber', (req, res) => {
  Violator.deleteOne({ serialNumber: req.params.serialNumber }).then(
    (deletion) => {
      res.send(deletion);
      console.log(deletion);
      console.log(req.params.serialNumber);
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
