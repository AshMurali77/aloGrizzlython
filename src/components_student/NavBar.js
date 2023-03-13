import * as React from "react";
import {
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  MenuItem,
  TextField,
} from "@mui/material";
import { useNavigate, useMatch } from "react-router-dom";
const NavBar = ({ width, site }) => {
  const institutionView = useMatch("/institution");
  const [page, setPage] = React.useState(site);
  let navigate = useNavigate();
  const routeChange = () => {
    console.log(institutionView);
    let path = "";
    institutionView ? (path = `/`) : (path = `/institution`);
    navigate(path);
  };
  const handleChange = (e) => {
    setPage(e.target.value);
    routeChange();
  };
  console.log(width);
  return (
    <AppBar
      position="fixed"
      sx={{ top: 0, height: 64, width: width, backgroundColor: "#F6F7F9" }}
      elevation={0}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField
          select
          value={page}
          onChange={handleChange}
          sx={{ minWidth: 120 }}
          InputProps={{ disableUnderline: true }}
          variant="standard"
        >
          <MenuItem value="student">Student View</MenuItem>
          <MenuItem value="institution">Institution View</MenuItem>
        </TextField>
        <IconButton>
          <Avatar>A</Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
