import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import axios from 'axios';
import DroneTable from './components/DroneTable';

const App = () => {
  const [drones, setDrones] = useState([]);
  const [violators, setViolators] = useState([]);
  const [snapshotTimestamp, setSnapshotTimestamp] = useState('');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      axios.get('http://localhost:3001/drones').then((res) => {
        setDrones(res.data.drones);
        setSnapshotTimestamp(res.data.snapshotTimestamp);
        setLoading(false);
        res.data.drones.forEach((drone) => {
          if (
            Math.sqrt(
              (drone.positionX - 250000) ** 2 + (drone.positionY - 250000) ** 2
            ) < 100000
          ) {
            getPilot(drone.serialNumber);
          }
        });
      });
    }, 2000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const getPilot = (serialNumber) => {
    axios.get(`http://localhost:3001/pilots/${serialNumber}`).then((res) => {
      const pilot = res.data;
      setViolators(
        violators.concat([
          {
            firstName: pilot.firstName,
            lastName: pilot.lastName,
            phoneNumber: pilot.phoneNumber,
            emaile: pilot.email,
          },
        ])
      );
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <div className="App">
        <p>Hello!</p>
        <p>Data last retrieved: {snapshotTimestamp}</p>
        <DroneTable drones={drones}></DroneTable>
        <h1>VIOLATORS:</h1>
        {violators.map((violator) => {
          return (
            <p>
              {violator.firstName} {violator.lastName}
            </p>
          );
        })}
      </div>
    </Container>
  );
};

export default App;

