import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import axios from 'axios';
import Drone from './components/Drone';

const App = () => {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/drones').then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <div className="App">
        <p>Hello!</p>
        {data.drones.map((drone) => {
          return <Drone drone={drone} key={drone.serialNumber}></Drone>;
        })}
      </div>
    </Container>
  );
};

export default App;

