import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Drone from './Drone';

const DroneTable = ({ drones }) => {
  return (
    <div>
      <h2>Drones detected:</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial number: </TableCell>
              <TableCell>X position: </TableCell>
              <TableCell>Y position: </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drones.map((drone) => {
              return <Drone drone={drone} key={drone.serialNumber}></Drone>;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DroneTable;
