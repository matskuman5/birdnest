import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3001/drones').then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <div className="App">
      <p>Hello!</p>
    </div>
  );
};

export default App;

