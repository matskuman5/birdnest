const express = require('express');
const axios = require('axios');
const convertxml = require('xml-js');

const app = express();

app.get('/', (req, res) => {
  axios.get('https://assignments.reaktor.com/birdnest/drones').then((xml) => {
    res.json(convertxml.xml2json(xml.data));
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
