import * as React from "react";
// MUI Component Imports
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material/";
// MUI Icon Imports
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";
import { Assessment, ContactSupport } from "@mui/icons-material";

export default function Sidebar(props) {
  const drawerWidth = props.drawerWidth;
  const handleSupportClick = () => {};
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: "#004777",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar paddingLeft={0} marginLeft={0}>
        <Box display={"inline-flex"} fontSize={40}>
          <Assessment fontSize={"inherit"} sx={{ color: "#fff" }} />
          <Typography variant="h5" paddingTop={1} noWrap color="#fff">
            ALO
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: "auto" }}>
        <List sx={{ color: "#fff" }}>
          <ListItem>
            <Button
              color="inherit"
              onClick={() => props.setView("students")}
              startIcon={<ArticleIcon />}
            >
              Students
            </Button>
          </ListItem>
          <ListItem>
            <Button
              color="inherit"
              onClick={() => props.setView("files")}
              startIcon={<SchoolIcon />}
            >
              Records
            </Button>
          </ListItem>
        </List>
        <Divider />
      </Box>
      <Box position="absolute" bottom={"5%"}>
        <List sx={{ color: "#fff" }}>
          <ListItem>
            <Button
              color="inherit"
              onClick={handleSupportClick}
              startIcon={<ContactSupport />}
            >
              Support
            </Button>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
