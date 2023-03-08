import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
const NavBar = (props) => {
  return (
    <AppBar
      position="fixed"
      sx={{ top: 0, height: 64, zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "inline-flex" }}>
          <AssessmentIcon />
          <Typography variant="h6" noWrap component="div">
            ALO
          </Typography>
        </Box>

        <IconButton>
          <Avatar>A</Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
