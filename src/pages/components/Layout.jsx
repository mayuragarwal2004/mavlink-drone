import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
// import { AppBar, Toolbar } from "@material-ui/core";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "./Layout.css";

const headersData = [
  {
    label: "Data",
    href: "/",
  },
  {
    label: "Plan",
    href: "/plan",
  },
];

const connectToData = [
  {
    value: "TCP",
    displayName: "TCP",
  },
  {
    value: "COM4",
    displayName: "COM4",
  },
];

const baudData = [
  {
    value: 1200,
    displayName: 1200,
  },
  {
    value: 57600,
    displayName: 57600,
  },
  {
    value: 115200,
    displayName: 115200,
  },
];

const Layout = () => {
  const [age, setAge] = React.useState("");

  const [connectType, setconnectType] = useState("");
  const [baud, setbaud] = useState();
  const handleconnectTypeChange = (event) => {
    setconnectType(event.target.value);
  };

  const handleBaudChange = (event) => {
    setbaud(event.target.value);
  };

  const displayDesktop = () => {
    return (
      <Toolbar className="toolbar">
        <div>{getMenuButtons()}</div>
        <div className="toolbar-child-right">
          {Logo}
          <FormControl variant="filled" sx={{ m: 1, minWidth: 90 }}>
            <InputLabel
              id="demo-simple-select-filled-label"
              sx={{
                color: "white",
                borderColor: "white",
                fontSize: 15
              }}
            >
              Connect Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={connectType}
              onChange={handleconnectTypeChange}
              sx={{
                color: "white",
                borderColor: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                ".MuiSvgIcon-root ": {
                  fill: "white !important",
                },
                "& .MuiInputBase-input": {
                  borderRadius: 2,
                  backgroundColor: "#323232",
                  // border: "1px solid white",
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {connectToData.map((item) => (
                <MenuItem value={item.value}>{item.displayName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 90 }}>
            <InputLabel
              id="demo-simple-select-filled-label"
              sx={{
                color: "white",
                borderColor: "white",
              }}
            >
              Baud
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={age}
              onChange={handleBaudChange}
              sx={{
                color: "white",
                borderColor: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                ".MuiSvgIcon-root ": {
                  fill: "white !important",
                },
                "& .MuiInputBase-input": {
                  borderRadius: 2,
                  backgroundColor: "#323232",
                  // border: "1px solid white",
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {baudData.map((item) => (
                <MenuItem value={item.value}>{item.displayName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button>Connect</Button>
        </div>
      </Toolbar>
    );
  };

  const Logo = (
    <Typography variant="h6" component="h1" className="logo">
      Vishwa Abhiyantas
    </Typography>
  );

  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Button
          {...{
            key: label,
            color: "inherit",
            to: href,
            component: Link,
            className: "menu-button",
          }}
        >
          {label}
        </Button>
      );
    });
  };

  return (
    <>
      <AppBar position="static" id="header">
        {displayDesktop()}
      </AppBar>
      <main className="home-main">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
