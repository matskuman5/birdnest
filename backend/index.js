const express = require('express');
const axios = require('axios');
const convertxml = require('xml-js');

const app = express();

app.get('/drones', (req, res) => {
  axios.get('https://assignments.reaktor.com/birdnest/drones').then((xml) => {
    const data = JSON.parse(convertxml.xml2json(xml.data));
    res.send(data.elements);
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
