import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { database } from "../base";
import { set, update, ref, onValue } from "firebase/database";
import "./Data.css";
import droneicon from "../drone-icon.png";
import { ReactComponent as RocketLaunch } from "../svgs/rocket-launch.svg";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { Canvas } from "react-three-fiber";
import ModelViewer from "./ModelViewer";
import { useData } from "./components/context/auth/DataState";
import { arm, disarm, portUpdate, requestConnect } from "./functionUtils";
import RightPanelComponent from "./components/RightPanelComponent";
import VehicleSelector from "./components/VehicleSelector";

import CircularProgress from "@mui/material/CircularProgress";
import Slider from "@mui/material/Slider";
import BatteryGauge from "react-battery-gauge";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ConnecitonIcon from "@mui/icons-material/Cable";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import MapIcon from "@mui/icons-material/Map";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Data = () => {
  const { data, client, serverInfo, selectedVehicle, setselectedVehicle } =
    useData();
  const [rpy, setrpy] = useState({ roll: 0, pitch: 0, yaw: 0 });
  const [droneData, setDroneData] = useState();
  const [showInfoWindow, setInfoWindowFlag] = useState(true);
  const [GPS, setGPS] = useState({ lat: 0, lng: 0 });
  const [altitude, setaltitude] = useState(0);
  const [battery, setbattery] = useState({
    current: null,
    level: 50,
    voltage: null,
  });
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [armStatus, setArmStatus] = useState({ isArm: false });
  const [rightPanel, setrightPanel] = useState(true);
  const [ports, setports] = useState([]);
  const [connectSelectOpen, setconnectSelectOpen] = useState(false);
  console.log(connectSelectOpen);
  // useEffect(() => {
  //   if (serverInfo.ports !== ports) {
  //     setports(serverInfo.ports);
  //     console.log("I ran");
  //   }
  // }, [serverInfo.ports]);

  // React.useEffect(() => {
  //   let active = true;

  //   if (!loading) {
  //     return undefined;
  //   }

  //   (async () => {
  //     // await sleep(1e3); // For demo purposes.

  //     if (active) {
  //       setports([...serverInfo.ports]);
  //     }
  //   })();

  //   return () => {
  //     active = false;
  //   };
  // }, [loading]);

  const handlerightpanelview = () => {
    setrightPanel((prev) => !prev);
  };

  const handleKeyPress = useCallback((event) => {
    if (event.key === "p") handlerightpanelview();
  }, []);

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    setDroneData(data);
    setrpy({
      roll: data?.ATTITUDE?.roll,
      pitch: data?.ATTITUDE?.pitch,
      yaw: data?.ATTITUDE?.yaw,
    });
    data?.GPS &&
      setGPS({ lat: data?.GPS_RAW_INT?.lat, lng: data?.GPS_RAW_INT?.lng });
    setaltitude(data?.GPS_RAW_INT?.alt);
    setbattery((prev) => ({ ...prev, ...data?.SYS_STATUS }));
    setArmStatus({ isArm: data?.HEARTBEAT?.armed });
  }, [data]);

  const toggleArm = () => {
    if (armStatus.isArm) {
      disarm(client);
    } else {
      arm(client);
    }
  };

  const [libraries] = useState(["places"]);
  const [userLoc, setUserLoc] = useState();
  const [center, setcenter] = useState({ lat: 18.479373, lng: 73.87337 });
  // const [activeMarker, setActiveMarker] = useState(null);
  const [zoom, setzoom] = useState(15);
  const [map, setMap] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const defaultMapOptions = {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
  };

  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        className="tab-panel"
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  const [connectType, setconnectType] = useState("");
  const [baud, setbaud] = useState("");
  const handleconnectTypeChange = (event) => {
    setconnectType(event.target.value);
  };

  const handleBaudChange = (event) => {
    setbaud(event.target.value);
  };

  return (
    <>
      <div className="maps-main-body">
        <div className="maps-body-gmap">
          {!isLoaded ? (
            <div className="loading">
              <CircularProgress />
            </div>
          ) : (
            <GoogleMap
              zoom={13}
              onLoad={(map) => {
                map.setMapTypeId("roadmap");
                map.setZoom(zoom);
                setMap(map);
                // console.log(map.getZoom());
                map.addListener("zoom_changed", () => {
                  setzoom(map.getZoom());
                });
              }}
              center={center ? center : userLoc}
              options={defaultMapOptions}
              mapContainerClassName="gmap"
              onClick={() => setActiveMarker(null)}
            >
              {Object.keys(data).map((item, i) => (
                <MarkerF
                  position={GPS}
                  icon={droneicon}
                  onClick={(props, marker) => {
                    setSelectedElement((prev) => !prev);
                    setActiveMarker(marker);
                  }}
                >
                  {selectedElement && (
                    <InfoWindowF
                      visible={showInfoWindow}
                      marker={activeMarker}
                      onCloseClick={() => {
                        setSelectedElement(null);
                      }}
                    >
                      <div>
                        <p>
                          Roll: {rpy.roll}
                          <br />
                          Pitch: {rpy.pitch}
                          <br />
                          Yaw: {rpy.yaw}
                        </p>

                        <p>
                          Latitude: {GPS.lat}
                          <br />
                          Longitude: {GPS.lng}
                        </p>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              ))}
            </GoogleMap>
          )}
        </div>
        <div className="maps-body">
          <div className="header-main-parent">
            <div className="left-header">
              <div className="vehicleID dropdown" style={{ float: "left" }}>
                <VehicleSelector />
              </div>
              <SettingsIcon />
            </div>
            {/* <div className="center-header">center</div> */}
            {selectedVehicle && data[selectedVehicle] && (
              <div className="right-header">
                <div className="header-right-info-block">
                  {data[selectedVehicle]?.HEARTBEAT?.flightmode}
                </div>
                <button
                  className="header-right-info-block"
                  onClick={() =>
                    data[selectedVehicle]?.HEARTBEAT?.armed
                      ? disarm(client, data[selectedVehicle].systemid)
                      : arm(client, data[selectedVehicle].systemid)
                  }
                >
                  {data[selectedVehicle]?.HEARTBEAT?.armed
                    ? "Armed"
                    : "Disarmed"}
                </button>
                {/* <div className="divider" /> */}
                <div className="battery-level">
                  <BatteryGauge
                    orientation="vertical"
                    customization={{
                      batteryBody: { strokeColor: "white" },
                      batteryCap: { strokeColor: "white" },
                      batteryMeter: { noOfCells: 10 },
                      readingText: { fontSize: 0 },
                    }}
                    size={20}
                    value={data[selectedVehicle].SYS_STATUS.level}
                  />
                  {data[selectedVehicle].SYS_STATUS.level}%
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="main-map-overlay">
          <div className="left-panel-main-parent">
            {/* <div className="left-menu"> */}
            <Box
              className="left-menu"
              sx={{
                flexGrow: 1,
                display: "flex",
                height: "95%",
              }}
            >
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: "divider" }}
              >
                <Tab
                  icon={<ConnecitonIcon />}
                  title="Connection"
                  {...a11yProps(0)}
                />
                <Tab icon={<MapIcon />} title="Planning" {...a11yProps(1)} />
                <Tab icon={<VisibilityOffIcon />} title="Hide" {...a11yProps(2)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                {Object.keys(data).map((item, i) => (
                  <div className="connection-panel" key={i}>
                    <div className="head">
                      <div className="connection-string">
                        {data[item].connection}
                      </div>
                      <button
                        className="header-right-info-block"
                        onClick={() =>
                          data[item]?.HEARTBEAT?.armed
                            ? disarm(client, data[item].systemid)
                            : arm(client, data[item].systemid)
                        }
                      >
                        {data[item]?.HEARTBEAT?.armed ? "Armed" : "Disarmed"}
                      </button>
                    </div>
                    <hr />
                    <div className="body">
                      <Grid container spacing={2}>
                        <Grid
                          item
                          xs={4}
                          className="connection-panel-grid-item"
                        >
                          <div>
                            <BatteryGauge
                              orientation="vertical"
                              customization={{
                                batteryBody: { strokeColor: "white" },
                                batteryCap: { strokeColor: "white" },
                                batteryMeter: { noOfCells: 10 },
                                readingText: { fontSize: 0 },
                              }}
                              size={20}
                              value={data[item].SYS_STATUS.level}
                            />
                            {data[item].SYS_STATUS.level && (
                              <>{data[item].SYS_STATUS.level}%</>
                            )}
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          className="connection-panel-grid-item"
                        >
                          <div>
                            <RocketLaunch className="rocket-launch-svg rotate-right" />
                            {data[item]?.VFR_HUD?.groundspeed?.toFixed(2) ||
                              0.0}
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          className="connection-panel-grid-item"
                        >
                          <div>
                            <RocketLaunch
                              className={"rocket-launch-svg ".concat(
                                data[item]?.VFR_HUD?.climb <= 0
                                  ? "rotate-bottom"
                                  : "rotate-top"
                              )}
                            />
                            {data[item]?.VFR_HUD?.climb?.toFixed(2) || 0.0}
                          </div>
                        </Grid>
                      </Grid>
                      <div className="battery-indicator"></div>
                    </div>
                  </div>
                ))}

                <div className="connect">
                  <FormControl
                    size="small"
                    variant="filled"
                    sx={{ m: 1, minWidth: 90 }}
                  >
                    <InputLabel
                      id="demo-simple-select-small-filled-label"
                      sx={{
                        color: "white",
                        borderColor: "white",
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
                      open={connectSelectOpen}
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
                        setconnectSelectOpen(true);
                      }}
                      onClose={() => {
                        setconnectSelectOpen(false);
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {serverInfo?.ports?.map((item, index) => (
                        <MenuItem key={index} value={item?.port}>
                          {item.port}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    size="small"
                    variant="filled"
                    sx={{ m: 1, minWidth: 90 }}
                  >
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
                        <MenuItem key={index} value={item.value}>
                          {item.displayName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    onClick={() =>
                      requestConnect(client, { connectType, baud })
                    }
                  >
                    Connect
                  </Button>
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                This is under devlopment.
              </TabPanel>
            </Box>
            {/* </div> */}
            <Slider
              sx={{
                '& input[type="range"]': {
                  WebkitAppearance: "slider-vertical",
                  background: "White",
                },
              }}
              value={zoom * 5}
              onChange={(e, val) => {
                setzoom(val);
                map.setZoom(val / 5);
              }}
              orientation="vertical"
              defaultValue={30}
              aria-label="Zoom"
              valueLabelDisplay="on"
              step={5}
              onKeyDown={preventHorizontalKeyboardNavigation}
            />
            {selectedVehicle && data[selectedVehicle] && (
              <div className="speed-and-rpy">
                  <div className="rpy">
                    <Canvas>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      <ModelViewer imudata={{ roll:data[selectedVehicle]?.ATTITUDE?.roll , pitch: data[selectedVehicle]?.ATTITUDE?.pitch, yaw: data[selectedVehicle]?.ATTITUDE?.yaw }} />
                    </Canvas>
                  </div>
              </div>
            )}
          </div>
          <div
            className={"right-panel-main-parent ".concat(
              rightPanel ? "active" : "inactive"
            )}
          >
            <div className="arrow-main-parent" onClick={handlerightpanelview}>
              {
                <ArrowBackIosNewIcon
                  sx={{ color: "white" }}
                  className="arrow-main"
                  id="arrow-main"
                />
              }
            </div>
            <div className="right-panel-body">
              <RightPanelComponent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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

export default Data;
