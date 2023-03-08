import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getStudentData } from "../utils/firebaseutils";
import { Button } from "@mui/material";

export default function StudentDataTable(props) {
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
  ];

  //Creating data for each row
  function createData(id, classification, firstName, lastName, credits, major) {
    return { id, classification, firstName, lastName, credits, major };
  }

  //Loads Row Data from db
  React.useEffect(() => {
    const loadRowData = async () => {
      const studentData = await getStudentData("students");
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
  }, []);
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
}
