import * as React from "react";
import { DataGrid, GridFooter, GridFooterContainer } from "@mui/x-data-grid";
import { getStudentData, uploadFiles } from "../utils/firebaseutils";
import { Box, Button } from "@mui/material";
import { ChangeCircle, NoteAdd, Delete } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

export default function StudentDataTable(props) {
  //track selected row
  const [selected, setSelected] = React.useState([]);
  //drawer width for column sizing
  const drawerWidth = props.drawerWidth;
  //Data table rows
  const [rows, setRows] = React.useState([]);

  //Setting column headers
  const columns = [
    {
      field: "classification",
      headerName: "Classification",
      width: 200,
    },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    { field: "credits", headerName: "Credits", type: "number", width: 90 },
    { field: "major", headerName: "Major", width: 130 },

    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    {
      field: "modifyRecord",
      headerName: "Modify Record",
      width: 160,
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          const api = params.api;
          const thisRow = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );

          return alert(JSON.stringify(thisRow, null, 4));
        };

        return (
          <Button sx={{ width: 160 }} variant="text" onClick={onClick}>
            <ChangeCircle />
          </Button>
        );
      },
    },
  ];

  //Creating data for each row
  function createData(id, classification, firstName, lastName, credits, major) {
    return { id, classification, firstName, lastName, credits, major };
  }

  //gets current url path
  let origin =
    useLocation().pathname === "/institution-one"
      ? "students"
      : "institution-two";

  //Upload to firebase storage & sync w web3
  const handleFileUpload = (e) => {
    e.preventDefault();
    uploadFiles(e.target.files[0], origin, selected[0]);
    uploadFiles(e.target.files[0], "files", selected[0]);
  };
  //Custom footer to be rendered with data table
  function CustomFooter() {
    return (
      <GridFooterContainer sx={{ justifyContent: "space-between" }}>
        <Box marginLeft={1}>
          <Button
            variant="contained"
            component="label"
            endIcon={<NoteAdd />}
            sx={{ marginRight: 1 }}
          >
            Mint Record
            <input type="file" onChange={(e) => handleFileUpload(e)} hidden />
          </Button>
          <Button
            variant="contained"
            endIcon={<Delete />}
            onClick={() => console.log("burning!")}
          >
            Burn Record
          </Button>
        </Box>
        <GridFooter
          sx={{
            border: "none", // To delete double border.
          }}
        />
      </GridFooterContainer>
    );
  }
  //Loads Row Data from db
  React.useEffect(() => {
    const loadRowData = async () => {
      const studentData = await getStudentData(origin);
      console.log("studentData", studentData);
      const newRowData = studentData.map((student) => {
        return createData(
          student.id,
          student.classification,
          student.firstName,
          student.lastName,
          student.credits,
          student.major
        );
      });

      setRows(newRowData);
    };
    loadRowData();
  }, [origin]);

  //handles row selection for data grid
  const handleRowSelection = async (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRowData = rows.filter((row) =>
      selectedIDs.has(row.id.toString())
    );
    setSelected(selectedRowData);
    console.log("selected:", selected, "rowdata", selectedRowData);
    //elected(e.selectionModel);
  };
  React.useEffect(() => {
    console.log(selected);
  }, [selected]);
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        onSelectionModelChange={(ids) => {
          handleRowSelection(ids);
        }}
        components={{ Footer: CustomFooter }}
      />
    </div>
  );
}
