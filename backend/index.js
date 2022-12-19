const express = require('express');
const axios = require('axios');
const convertxml = require('xml-js');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/drones', (req, res) => {
  axios.get('https://assignments.reaktor.com/birdnest/drones').then((xml) => {
    const data = JSON.parse(convertxml.xml2json(xml.data));
    res.send(data.elements);
  });
});

app.get('/pilots', (req, res) => {
  axios
    .get(`assignments.reaktor.com/birdnest/pilots/${req.body.serialNumber}`)
    .then((pilots) => {
      res.send(pilots);
    });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
