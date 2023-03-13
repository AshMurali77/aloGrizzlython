import * as React from "react";
// MUI Component Imports
import { Box, CssBaseline, Typography } from "@mui/material";
// Component Imports
import FileView from "./FileView";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const drawerWidth = 180;
const navHeight = 64;

export function Dashboard() {
  //get screen size
  const windowSize = React.useRef([window.innerWidth, window.innerHeight]);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar width={windowSize.current[0] - drawerWidth} />
      <Sidebar drawerWidth={drawerWidth} />
      <Box
        component="main"
        position="fixed"
        width={windowSize.current[0] - drawerWidth}
        height={windowSize.current[1] - navHeight}
        sx={{
          top: navHeight,
          left: drawerWidth,
          bgcolor: "#F6F7F9",
        }}
      >
        <Box marginLeft={"2%"} marginBottom={2}>
          <Typography variant="h5" fontWeight={"bold"}>
            Documents
          </Typography>
        </Box>
        <Box marginLeft={"2%"} marginRight={"2%"}>
          <FileView
            windowHeight={windowSize.current[1]}
            navHeight={navHeight}
          />
        </Box>
      </Box>
    </Box>
  );
}
