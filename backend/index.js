const express = require('express');
const axios = require('axios');
const convertxml = require('xml-js');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/drones', (req, res) => {
  axios.get('https://assignments.reaktor.com/birdnest/drones').then((xml) => {
    const data = JSON.parse(convertxml.xml2json(xml.data));
    const droneData = data.elements[0].elements[1];
    const drones = {
      snapshotTimestamp: droneData.attributes.snapshotTimestamp,
      drones: droneData.elements.map((d) => {
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
      }),
    };
    res.send(drones);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
