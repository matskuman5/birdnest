import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import axios from 'axios';
import DroneTable from './components/DroneTable';
import ViolatorTable from './components/ViolatorTable';

const App = () => {
  const [drones, setDrones] = useState([]);
  const [violators, setViolators] = useState([]);
  const [snapshotTimestamp, setSnapshotTimestamp] = useState('');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      axios.get('/data').then((res) => {
        setDrones(res.data.drones);
        setViolators(res.data.violators);
        const time = new Date(res.data.snapshotTimestamp);
        setSnapshotTimestamp(time.toString());
        setLoading(false);
      });
    }, 2000);
    return () => {
      clearInterval(id);
    };
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <div className="App">
        <p>Hello, welcome to the birdnest app!</p>
        <p>Author: Matias Selin (https://github.com/matskuman5)</p>
        <p>Data last retrieved: {snapshotTimestamp}</p>
        <DroneTable drones={drones}></DroneTable>
        <ViolatorTable violators={violators}></ViolatorTable>
      </div>
    </Container>
  );
};

export default App;
