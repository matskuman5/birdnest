const Drone = ({ drone }) => {
  return (
    <div>
      <p>Serial number: {drone.serialNumber}</p>
      <p>Model: {drone.model}</p>
      <p>X: {drone.positionX}</p>
      <p>Y: {drone.positionY}</p>
    </div>
  );
};

export default Drone;
