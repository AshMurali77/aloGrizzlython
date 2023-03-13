import * as React from "react";
import {
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  MenuItem,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const NavBar = ({ width, site }) => {
  let path = "";
  const [page, setPage] = React.useState(site);
  let navigate = useNavigate();
  React.useEffect(() => {
    console.log("page", page);
    path = page;
    navigate(`/${path}`);
  }, [page]);

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
          onChange={(e) => setPage(e.target.value)}
          sx={{ minWidth: 120 }}
          InputProps={{ disableUnderline: true }}
          variant="standard"
        >
          <MenuItem value="student">Student View</MenuItem>
          <MenuItem value="institution-one">Institution One View</MenuItem>
          <MenuItem value="institution-two">Institution Two View</MenuItem>
        </TextField>
        <IconButton>
          <Avatar>A</Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
