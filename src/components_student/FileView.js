import * as React from "react";
// MUI Component Import
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
//material icon imports
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import { Task } from "@mui/icons-material";
//Util function imports
import {
  getFileData,
  getStudentFileData,
  updateFileData,
} from "../utils/firebaseutils";
import { getLeavesFromFirebase } from "../utils/web3utils";
import { requestToken } from "../utils/authToken";
//Column Headers and Formatting
const columns = [
  { id: "filename", label: "File Name", minWidth: 170 },
  { id: "filesize", label: "File Size", minWidth: 100 },
  { id: "accessdate", label: "Access Date", minWidth: 100 },
];

//Creating data for each row
function createData(
  link,
  fullPath,
  customMetadata,
  filename,
  filesize,
  accessdate
) {
  return { link, fullPath, customMetadata, filename, filesize, accessdate };
}
//setting width of file preview drawer
const drawerWidth = 350;

//Main content Area
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

export default function FileView(props) {
  //Edit for different student views
  const studentID = "bb44786";

  const navHeight = props.navHeight;
  const fileScrollHeight = props.windowHeight - navHeight;

  const [rows, setRows] = React.useState([]);
  //for file search
  const [filteredRows, setFilteredRows] = React.useState([]);
  //for file selection and drawer opening
  const [selected, setSelected] = React.useState();

  //access row data and load it into the rows
  React.useEffect(() => {
    const loadRowData = async () => {
      const [fileData, downloadData] = await getStudentFileData(studentID);
      const newRowData = fileData.map((data, index) => {
        return createData(
          downloadData[index],
          data.fullPath,
          data.customMetadata,
          data.name,
          data.size,
          data.timeCreated
        );
      });

      setRows(newRowData);
      setFilteredRows(newRowData);
    };
    loadRowData();
  }, []);

  //File Search
  const handleSearch = (e) => {
    setRows(
      filteredRows.filter((row) => {
        console.log(e.target.value);
        return row.filename.includes(e.target.value);
      })
    );
  };

  //File selection
  const handleSelect = (e, row) => {
    selected === row ? setSelected(null) : setSelected(row);
    console.log(row);
  };

  //File transfer
  const handleTransferFile = (e, docID) => {
    //requestToken(docID);
    updateFileData(selected.fullPath);
    getFileData("students");
    getLeavesFromFirebase("students");
  };

  return (
    <>
      <Box
        backgroundColor={"#F6F7F9"}
        display={"flex"}
        height={fileScrollHeight}
      >
        <Main open={selected}>
          <Box>
            <TableContainer
              component={Paper}
              sx={{ height: fileScrollHeight / 1.5 }}
            >
              <Box
                height="10%"
                paddingTop={2}
                display={"flex"}
                alignItems={"center"}
              >
                <Autocomplete
                  freeSolo
                  fullWidth
                  options={rows.map((row) => row.filename)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              type="button"
                              sx={{ p: "10px" }}
                              aria-label="search"
                            >
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        disableUnderline: true,
                      }}
                      placeholder="Search Files"
                      onChange={handleSearch}
                    />
                  )}
                />
              </Box>
              <Table
                stickyHeader
                aria-label="sticky table"
                id="drawer-container"
              >
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
                  {rows.map((row, index) => {
                    const isItemSelected = selected === row;
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(e) => handleSelect(e, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          {row.filename}
                        </TableCell>
                        <TableCell>{row.filesize}</TableCell>
                        <TableCell>{row.accessdate}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Main>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          PaperProps={{
            elevation: 1,
            borderRadius: 25,
            sx: {
              height: fileScrollHeight / 1.5,
              marginTop: "4.4%",
              marginRight: "2%",
              position: "absolute",
            },
          }}
          variant={"persistent"}
          anchor={"right"}
          open={selected}
        >
          <Box
            fontSize={18}
            height={navHeight}
            display={"inline-flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Task fontSize="inherit" />
            <Typography color={"#000"}>
              {selected && selected.filename}
            </Typography>
          </Box>

          <Box
            width={"95%"}
            height={"95%"}
            borderRadius={5}
            paddingTop={1}
            justifyContent={"center"}
            display={"flex"}
            mx={"auto"}
            bgcolor={"#F2F6FC"}
          >
            {selected ? (
              <>
                <Stack spacing={2}>
                  <Stack>
                    <Typography color={"#000"} fontSize={14}>
                      Name
                    </Typography>
                    <Typography color={"#000"}>{selected.filename}</Typography>
                  </Stack>
                  <Stack>
                    <Typography>Size</Typography>
                    <Typography color={"#000"}>{selected.filesize}</Typography>
                  </Stack>
                  <Stack>
                    <Typography>Type</Typography>
                    <Typography color={"#000"}>application/pdf</Typography>
                  </Stack>
                  <Stack>
                    <Typography>Access Date</Typography>
                    <Typography color={"#000"}>
                      {selected.accessdate}
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    sx={{
                      marginBottom: "2%",
                      marginLeft: "5%",
                      marginRight: "5%",
                    }}
                    href={selected.link}
                    target="_blank"
                    endIcon={<DownloadIcon />}
                  >
                    Download File
                  </Button>
                  <Button
                    variant="contained"
                    onClick={(e) => handleTransferFile(e, selected.link)}
                    endIcon={<SendIcon />}
                    sx={{ marginLeft: "5%", marginRight: "5%" }}
                  >
                    Transfer File
                  </Button>
                </Stack>
              </>
            ) : (
              <Typography color={"#000"}>Select a file to preview</Typography>
            )}
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
