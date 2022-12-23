require('dotenv').config();

const express = require('express');
const axios = require('axios');
const convertxml = require('xml-js');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.static('build'));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI);

const droneSchema = new mongoose.Schema({
  serialNumber: String,
  positionX: Number,
  positionY: Number,
});

const Drone = mongoose.model('Drone', droneSchema);

const violatorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: String,
  serialNumber: String,
  violationTime: String,
  closestViolation: Number,
});

const Violator = mongoose.model('Violator', violatorSchema);

app.get('/drones', (req, res) => {
  axios.get('https://assignments.reaktor.com/birdnest/drones').then((xml) => {
    const data = JSON.parse(convertxml.xml2json(xml.data));
    const droneData = data.elements[0].elements[1];
    const dronesAPI = droneData.elements.map((d) => {
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

    Drone.find({}).then((dronesDB) => {
      const final = {
        snapshotTimestamp: droneData.attributes.snapshotTimestamp,
        drones: dronesAPI.concat(dronesDB),
      };
      res.send(final);
    });
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
  Violator.find({}).then((violators) => {
    res.send(violators);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
