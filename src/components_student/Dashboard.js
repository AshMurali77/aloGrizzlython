import * as React from "react";
// MUI Component Imports
import { Box, CssBaseline } from "@mui/material";
// Component Imports
import FileView from "./FileView";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const drawerWidth = 256;
const navHeight = 64;

export function Dashboard() {
  //get screen size
  const windowSize = React.useRef([window.innerWidth, window.innerHeight]);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        position="fixed"
        width={windowSize.current[0] - drawerWidth}
        height={windowSize.current[1] - navHeight}
        sx={{
          top: navHeight,
          left: drawerWidth,
          bgcolor: "fff",
        }}
      >
        <Box
          height={windowSize.current[1] - navHeight / 2}
          borderRight={1}
          borderRightColor={"#000"}
          sx={{
            width: "100%",
          }}
        >
          <FileView navHeight={navHeight} />
        </Box>
      </Box>
    </Box>
  );
}
