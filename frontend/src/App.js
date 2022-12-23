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
    axios.get('/violators').then((res) => {
      setViolators(res.data);
    });

    const id = setInterval(() => {
      axios.get('/drones').then((res) => {
        setDrones(res.data.drones);
        setSnapshotTimestamp(res.data.snapshotTimestamp);
        setLoading(false);
      });
    }, 2000);
    return () => {
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    drones.forEach((drone) => {
      const distance = Math.sqrt(
        (drone.positionX - 250000) ** 2 + (drone.positionY - 250000) ** 2
      );
      if (distance < 100000) {
        getPilot(drone.serialNumber, distance);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drones]);

  // remove violators after 10 minutes
  // REWORK THIS USING SETTIMER!!!!!!!!!!!!!!
  useEffect(() => {
    const id = setInterval(() => {
      setViolators(
        violators.filter((violator) => {
          const currentTime = Date.now();
          const violationTime = new Date(violator.violationTime);
          return currentTime - violationTime < 1000 * 60 * 10;
        })
      );
    }, 2000);
    return () => {
      clearInterval(id);
    };
  }, [violators]);

  const getPilot = (serialNumber, distance) => {
    axios.get(`pilots/${serialNumber}`).then((res) => {
      const pilot = {
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        phoneNumber: res.data.phoneNumber,
        email: res.data.email,
        serialNumber: serialNumber,
        violationTime: Date.now(),
        closestViolation: distance,
      };
      const oldViolator = violators.find(
        (p) => p.serialNumber === serialNumber
      );
      if (oldViolator === undefined) {
        setViolators(violators.concat([pilot]));
      } else {
        if (pilot.closestViolation > oldViolator.closestViolation) {
          pilot.closestViolation = oldViolator.closestViolation;
        }
        setViolators(
          violators.map((violator) => {
            if (violator.serialNumber === pilot.serialNumber) {
              return pilot;
            }
            return {
              ...violator,
            };
          })
        );
      }
    });
  };

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
