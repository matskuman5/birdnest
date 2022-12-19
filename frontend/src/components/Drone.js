import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const Drone = ({ drone }) => {
  return (
    <TableRow>
      <TableCell>{drone.serialNumber}</TableCell>
      <TableCell>{drone.positionX}</TableCell>
      <TableCell>{drone.positionY}</TableCell>
    </TableRow>
  );
};

export default Drone;
