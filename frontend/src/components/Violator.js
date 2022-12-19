import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const Violator = ({ violator }) => {
  const time = new Date(violator.violationTime);

  return (
    <TableRow>
      <TableCell>
        {violator.firstName} {violator.lastName}
      </TableCell>
      <TableCell>{violator.email}</TableCell>
      <TableCell>{violator.phoneNumber}</TableCell>
      <TableCell>{violator.serialNumber}</TableCell>
      <TableCell>{time.toString()}</TableCell>
      <TableCell>{(violator.closestViolation / 1000).toFixed()} m</TableCell>
    </TableRow>
  );
};

export default Violator;
