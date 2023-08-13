import * as React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Paper
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const columns = [
  { id: "evidenceUniqueCode", label: "ID", minWidth: 100 },
  { id: "evidenceName", label: "Name", minWidth: 100 },
  { id: "evidenceType", label: "Age", minWidth: 100 },
  { id: "evidenceOwner", detail: "name" ,label: "Owner", minWidth: 100 },
  { label: "Actions", minWidth: 100}
];

function EvidencesTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {console.log(props.EvidencesData[1]["evidenceOwner"]["name"])}
      <TableContainer sx={{ maxHeight: 540 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.EvidencesData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.evidenceUniqueCode}>
                    {columns.map((column) => {
                      var value = row[column.id];
                      if (column.detail != undefined){
                        value= value[column.detail]
                      }

                      if (column.label === "Actions"){
                        value = <div><Button>Update</Button> <Button><DeleteForeverIcon/></Button></div>
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.EvidencesData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default EvidencesTable;
