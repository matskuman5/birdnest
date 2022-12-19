import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const Drone = ({ drone }) => {
  return (
    <TableRow>
      <TableCell>{drone.serialNumber}</TableCell>
      <TableCell>{drone.positionX.toFixed()}</TableCell>
      <TableCell>{drone.positionY.toFixed()}</TableCell>
    </TableRow>
  );
};

export default Drone;
