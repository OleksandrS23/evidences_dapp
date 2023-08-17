import * as React from "react";
import {
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
import {History, Edit, Send} from '@mui/icons-material';
import { createTheme, ThemeProvider  } from '@mui/material/styles';
import EditEvidence from "./EditEvidence";
import SendEvidence from "./SendEvidence";
import HistoryEvidence from "./HistoryEvidence";

let theme = createTheme({
  // Theme customization goes here as usual, including tonalOffset and/or
  // contrastThreshold as the augmentColor() function relies on these
});

theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    salmon: theme.palette.augmentColor({
      color: {
        main: '#FF5733',
      },
      name: 'salmon',
    }),
  },
});

const columns = [
  { id: "evidenceUniqueCode", label: "ID", minWidth: 100 },
  { id: "evidenceName", label: "Name", minWidth: 100 },
  { id: "evidenceType", label: "Type", minWidth: 100 },
  { id: "evidenceOwner", detail: "name" ,label: "Owner", minWidth: 100 },
  { label: "Actions", minWidth: 100}
];


function EvidencesTable(props) {
  const [showEditPopup, setShowEditPopup] = React.useState(false);
  const [showHistoryPopup, setShowHistoryPopup] = React.useState(false);
  const [showSendPopup, setShowSendPopup] = React.useState(false);
  const [actualData, setActualData] = React.useState({});

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const openEditPopup = (data) => {
    setActualData(data)
    setShowEditPopup(true)
  };
  const closeEditPopup = () => {
    setShowEditPopup(false)
    setActualData('')
  };

  const openHistoryPopup = (data) => {
    setActualData(data)
    setShowHistoryPopup(true)
  };
  const closeHistoryPopup = () => {
    setShowHistoryPopup(false)
    setActualData('')
  };

  const openSendPopup = (data) => {
    setActualData(data)
    setShowSendPopup(true)
  };
  const closeSendPopup = () => {
    setShowSendPopup(false)
    setActualData('')
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <ThemeProvider theme={theme}>
      <EditEvidence show={showEditPopup} onClose={closeEditPopup} drizzleContext = {props.drizzleContext} data = {actualData}/>
      <SendEvidence show={showSendPopup} onClose={closeSendPopup} drizzleContext = {props.drizzleContext} data = {actualData}/>
      <HistoryEvidence show={showHistoryPopup} onClose={closeHistoryPopup} drizzleContext = {props.drizzleContext} data = {actualData}/>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                      if (column.detail !== undefined){
                        value= value[column.detail]
                      }

                      if (column.label === "Actions"){
                        // console.log(row)
                        if (props.drizzleContext.drizzleState.accounts[0] === row.evidenceOwner.entityAddress)
                        {
                          value = <div>
                          <Button onClick = {() => openEditPopup(row)} color = "salmon"><Edit/></Button> 
                          <Button onClick = {() => openHistoryPopup(row)}><History/></Button>
                          <Button onClick = {() => openSendPopup(row)} color = "success" ><Send/></Button>
                        </div>
                        }
                        else
                        {
                          value = <Button onClick = {() => openHistoryPopup(row)}><History/></Button>    
                        }
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
    </ThemeProvider>
  );
}

export default EvidencesTable;
