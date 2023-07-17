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
