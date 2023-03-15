import * as React from "react";
// MUI Component Imports
import { Box, CssBaseline, Typography } from "@mui/material";
// Component Imports
import FileView from "./FileView";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const drawerWidth = 180;
const navHeight = 64;
//store a random 32 byte Uint8Array
export function generateKeypair(name) {
  // Check if the key already exists in local storage
  let array = null;
  if (localStorage.getItem(name) !== null) {
    // If the key exists, retrieve the value and convert it to a Uint8Array
    const storedArray = JSON.parse(localStorage.getItem(name));
    array = new Uint8Array(storedArray);
  } else {
    // If the key does not exist, generate a random 32-byte Uint8Array
    array = new Uint8Array(32);
    window.crypto.getRandomValues(array);

    // Store the array in local storage
    localStorage.setItem(name, JSON.stringify(Array.from(array)));
  }

  // Use the array as needed
  console.log(array);
  return array;
}
export function Dashboard() {
  generateKeypair();
  //get screen size
  const windowSize = React.useRef([window.innerWidth, window.innerHeight]);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar site="student" width={windowSize.current[0] - drawerWidth} />
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
