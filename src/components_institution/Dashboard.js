import * as React from "react";
// MUI Component Imports
import { Box, CssBaseline, Stack, Typography } from "@mui/material";
// Component Imports
import StudentView from "./StudentView";
import FileView from "./FileView";
import Navbar from "../components_student/NavBar";
import Sidebar from "./Sidebar";
const navHeight = 64;
const drawerWidth = 160;
export function Dashboard({ number }) {
  //Show student versus incoming files view
  const [view, setView] = React.useState("student");
  //get screen size
  const windowSize = React.useRef([window.innerWidth, window.innerHeight]);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar
        site={`institution-${number}`}
        width={windowSize.current[0] - drawerWidth}
      />
      <Sidebar drawerWidth={drawerWidth} setView={setView} />
      <Box
        component="main"
        position="fixed"
        height={windowSize.current[1] - navHeight}
        width={windowSize.current[0] - drawerWidth}
        sx={{
          left: drawerWidth,
          top: navHeight,
          bgcolor: "#F6F7F9",
        }}
      >
        <Box marginLeft={"2%"} marginBottom={2}>
          {view == "files" ? (
            <Typography variant="h5" fontWeight={"bold"}>
              Incoming Records
            </Typography>
          ) : (
            <Typography variant="h5" fontWeight={"bold"}>
              Student Data
            </Typography>
          )}
        </Box>
        {view == "files" ? (
          <Box marginLeft={"2%"} marginRight={"2%"}>
            <FileView
              windowHeight={windowSize.current[1]}
              navHeight={navHeight}
            />
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              width: "96%",
            }}
            marginLeft={"2%"}
            marginRight={"2%"}
          >
            <StudentView drawerWidth />
          </Box>
        )}
      </Box>
    </Box>
  );
}
