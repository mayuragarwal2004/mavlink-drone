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
import { useData } from "./context/auth/DataState";
import { portUpdate, requestConnect } from "../functionUtils";

import pcbpowerlogo from "../../PCB_Power.png"

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
  const { data, client } = useData();

  const [connectType, setconnectType] = useState("");
  const [baud, setbaud] = useState("");
  const handleconnectTypeChange = (event) => {
    setconnectType(event.target.value);
  };

  const handleBaudChange = (event) => {
    setbaud(event.target.value);
  };

  // const requestConnect = () => {
  //   client.send(
  //     JSON.stringify({
  //       type: "message",
  //       purpose: "ConnectVehicle",
  //       port: connectType,
  //       baud
  //     })
  //   );
  // };

  const displayDesktop = () => {
    return (
      <Toolbar className="toolbar">
        <div>{getMenuButtons()}</div>
        <div className="toolbar-child-right">
          <img src={pcbpowerlogo} alt="pcb power" style={{height:"50px", margin: "0 10px"}} />
          {Logo}
          <FormControl size="small" variant="filled" sx={{ m: 1, minWidth: 90 }}>
            <InputLabel
              id="demo-simple-select-small-filled-label"
              sx={{
                color: "white",
                borderColor: "white",
                fontSize: 10,
              }}
              onClick={() => console.log("clicked 1")}
            >
              Connect Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-small-filled-label"
              id="demo-simple-select-small-filled"
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
              onOpen={() => {
                portUpdate(client);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {data?.ports?.map((item, index) => (
                <MenuItem key={index} value={item?.port}>{item.port}</MenuItem>
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
              value={baud}
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
              {baudData.map((item, index) => (
                <MenuItem key={index} value={item.value}>{item.displayName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={()=>requestConnect(client, {connectType, baud})}>Connect</Button>
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
