import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const Violator = ({ violator }) => {
  return (
    <TableRow>
      <TableCell>
        {violator.firstName} {violator.lastName}
      </TableCell>
      <TableCell>{violator.email}</TableCell>
      <TableCell>{violator.phoneNumber}</TableCell>
      <TableCell>{violator.serialNumber}</TableCell>
    </TableRow>
  );
};

export default Violator;
