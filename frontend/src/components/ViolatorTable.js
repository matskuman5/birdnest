import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Violator from './Violator';

const ViolatorTable = ({ violators }) => {
  return (
    <div>
      <h2>VIOLATORS:</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name:</TableCell>
              <TableCell>Email:</TableCell>
              <TableCell>Phone number:</TableCell>
              <TableCell>Drone serial number:</TableCell>
              <TableCell>Last detected violation:</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {violators.map((violator) => {
              return (
                <Violator
                  violator={violator}
                  key={violator.serialNumber}
                ></Violator>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ViolatorTable;
