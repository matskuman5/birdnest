import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const Drone = ({ drone }) => {
  return (
    <TableRow>
      <TableCell>{drone.serialNumber}</TableCell>
      <TableCell>{drone.positionX.toFixed()}</TableCell>
      <TableCell>{drone.positionY.toFixed()}</TableCell>
      <TableCell>
        {(
          Math.sqrt(
            (drone.positionX - 250000) ** 2 + (drone.positionY - 250000) ** 2
          ) / 1000
        ).toFixed()}{' '}
        m
      </TableCell>
    </TableRow>
  );
};

export default Drone;
