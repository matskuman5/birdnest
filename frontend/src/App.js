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
      axios.get('/drones').then((res) => {
        setDrones(res.data.drones);
        setSnapshotTimestamp(res.data.snapshotTimestamp);
        setLoading(false);
      });
      axios.get('/violators').then((res) => {
        setViolators(res.data);
      });
    }, 2000);
    return () => {
      clearInterval(id);
    };
  }, []);

  // remove violators after 10 minutes
  // REWORK THIS USING SETTIMER!!!!!!!!!!!!!!
  useEffect(() => {
    const id = setInterval(() => {
      const toDelete = violators.filter((violator) => {
        const currentTime = Date.now();
        const violationTime = new Date(violator.violationTime);
        return currentTime - violationTime > 1000 * 60 * 10;
      });
      toDelete.forEach((violator) => {
        axios.delete(`/violators/${violator.serialNumber}`);
      });
      setViolators(
        violators.filter((violator) => !toDelete.includes(violator))
      );
    }, 2000);
    return () => {
      clearInterval(id);
    };
  }, [violators]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <div className="App">
        <p>Hello, welcome to the birdnest app!</p>
        <p>Data last retrieved: {snapshotTimestamp}</p>
        <DroneTable drones={drones}></DroneTable>
        <ViolatorTable violators={violators}></ViolatorTable>
      </div>
    </Container>
  );
};

export default App;
