import * as React from "react";
// MUI Component Imports
import { Box, CssBaseline } from "@mui/material";
// Component Imports
import StudentView from "./StudentView";
import FileView from "./FileView";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
const navHeight = 64;
const drawerWidth = 256;
export function Dashboard() {
  //Show student versus incoming files view
  const [view, setView] = React.useState("student");
  //get screen size
  const windowSize = React.useRef([window.innerWidth, window.innerHeight]);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />
      <Sidebar setView={setView} />
      <Box
        component="main"
        display={"flex"}
        position="fixed"
        height={windowSize.current[1] - navHeight}
        width={windowSize.current[0] - drawerWidth}
        sx={{
          left: drawerWidth,
          top: navHeight,
          bgcolor: "fff",
        }}
      >
        {view == "files" ? (
          <Box
            borderRight={1}
            borderRightColor={"#000"}
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            <FileView navHeight={navHeight} />
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            <StudentView drawerWidth />
          </Box>
        )}
      </Box>
    </Box>
  );
}
