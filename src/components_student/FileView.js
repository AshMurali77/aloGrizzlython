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
//Util function imports
import { getFileData, updateFileData } from "../utils/firebaseutils";
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
  const navHeight = props.navHeight;
  const [rows, setRows] = React.useState([]);
  //for file search
  const [filteredRows, setFilteredRows] = React.useState([]);
  //for file selection and drawer opening
  const [selected, setSelected] = React.useState();

  //access row data and load it into the rows
  React.useEffect(() => {
    const loadRowData = async () => {
      const [fileData, downloadData] = await getFileData("files");
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
    getFileData("files");
  };

  return (
    <>
      <Box display={"flex"} height={"100%"}>
        <Main open={selected}>
          <Box>
            <Paper
              component="form"
              sx={{
                backgroundColor: "#C4C4C4",
                p: "2px",
                display: "flex",
                alignItems: "center",
                borderRadius: 0,
              }}
            >
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                fullWidth
                options={rows.map((row) => row.filename)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          {" "}
                          <IconButton
                            type="button"
                            sx={{ p: "10px" }}
                            aria-label="search"
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: { borderColor: "#C4C4C4" },
                    }}
                    placeholder="Search Files"
                    onChange={handleSearch}
                  />
                )}
              />
            </Paper>

            <Paper sx={{ overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: "100%" }}>
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
            </Paper>
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
          variant={"persistent"}
          anchor={"right"}
          open={selected}
        >
          <Box height={navHeight}></Box>
          <Box>
            {selected ? (
              <>
                <Stack spacing={0}>
                  <Stack>
                    <Typography>File Name</Typography>
                    <Typography color={"#000"}>{selected.filename}</Typography>
                  </Stack>
                  <Stack>
                    <Typography>File Size</Typography>
                    <Typography color={"#000"}>{selected.filesize}</Typography>
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
