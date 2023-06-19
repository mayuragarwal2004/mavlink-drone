import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { database } from "../base";
import { set, update, ref, onValue } from "firebase/database";
import "./Data.css";
import droneicon from "../drone-icon.png";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import CircularProgress from "@mui/material/CircularProgress";
import Slider from "@mui/material/Slider";
import BatteryGauge from "react-battery-gauge";
import SettingsIcon from "@mui/icons-material/Settings";
import { Canvas } from "react-three-fiber";
import ModelViewer from "./ModelViewer";

const Data = () => {
  const [rpy, setrpy] = useState({ roll: 0, pitch: 0, yaw: 0 });
  const [droneData, setDroneData] = useState();
  const [showInfoWindow, setInfoWindowFlag] = useState(true);
  const [GPS, setGPS] = useState({ lat: 0, lng: 0 });
  const [altitude, setaltitude] = useState(0);
  const [battery, setbattery] = useState({ voltage: null });
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [armStatus, setArmStatus] = useState({
    set_to_arm: false,
    set_to_disarm: false,
    isArm: false,
  });

  const homeref = ref(database, "/");
  useEffect(() => {
    onValue(homeref, (snapshot) => {
      const data = snapshot.val();
      setDroneData(data);
      setrpy({
        roll: data?.Attitude?.roll,
        pitch: data?.Attitude?.pitch,
        yaw: data?.Attitude?.yaw,
      });
      data?.GPS &&
        setGPS({ lat: data?.GPS_RAW_INT?.lat, lng: data?.GPS_RAW_INT?.lng });
      setaltitude(data?.GPS_RAW_INT?.alt);
      setbattery((prev) => ({ ...prev, voltage: data?.Battery?.voltage }));
      setArmStatus((prev) => ({
        ...prev,
        set_to_arm: data?.ArmStatus?.set_to_arm,
        set_to_disarm: data?.ArmStatus?.set_to_disarm,
        isArm: data?.ArmStatus?.isArm,
      }));
    });
  }, []);

  const toggleArm = () => {
    if (armStatus.isArm) {
      const postData = {};
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      };
      fetch("/api/disarm", requestOptions).then((response) => response.json());
      update(ref(database, "ArmStatus"), { set_to_disarm: true });
    } else {
      const postData = {};
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      };
      fetch("/api/arm", requestOptions).then((response) => response.json());
      update(ref(database, "ArmStatus"), { set_to_arm: true });
    }
  };

  console.log(droneData);

  var panel;

  const panImage = React.useRef(null);

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
                map.setMapTypeId("satellite");
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
              {GPS.lat && GPS.lng && (
                <MarkerF
                  position={GPS}
                  icon={droneicon}
                  onClick={(props, marker) => {
                    setSelectedElement((prev) => !prev);
                    setActiveMarker(marker);
                  }}
                >
                  {selectedElement ? (
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
                  ) : null}
                  {/* {activeMarker === i && (
                  <InfoWindow
                    onCloseClick={() => {
                      setActiveMarker(null);
                    }}
                  >
                    <div>Updated: {moment(val.timestamp).fromNow()}</div>
                  </InfoWindow>
                )} */}
                </MarkerF>
              )}
            </GoogleMap>
          )}
        </div>
        <div className="maps-body">
          <div className="header-main-parent">
            <div className="left-header">
              <div className="vehicleID dropdown" style={{ float: "left" }}>
                <button className="dropbtn">Vehicle 1</button>
                <div className="dropdown-content" style={{ left: 0 }}>
                  <div className="dropdown-content-block">Vehicle 2</div>
                  <div className="dropdown-content-block">Vehicle 3</div>
                </div>
              </div>
              <SettingsIcon />
            </div>
            {/* <div className="center-header">center</div> */}
            <div className="right-header">
              <div className="header-right-info-block">Manual</div>
              <button className="header-right-info-block" onClick={toggleArm}>
                {armStatus.isArm ? "Armed" : "Disarmed"}
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
                  value={40}
                />
                {battery.voltage}V
              </div>
            </div>
          </div>
        </div>
        <div className="zoom-slider">
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
          <div className="speed-and-rpy">
            <div className="speed speed-and-rpy-child">
              <div>Ground Speed</div>
              <div>{Math.round(droneData?.Groundspeed)}</div>
            </div>
            <div className="altitude speed-and-rpy-child">
              <div>Altitude</div>
              <div>{altitude}</div>
            </div>
            <div className="rpy-parent">
              <div className="rpy">
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <ModelViewer imudata={rpy} />
                </Canvas>
                {/* <div
                  id="panel"
                  style={{
                    transform:
                      "rotateX(" +
                      rpy.roll +
                      "deg) rotateY(" +
                      rpy.pitch +
                      "deg) rotateZ(" +
                      rpy.yaw +
                      "deg)",
                  }}
                >
                  <svg
                    id="Layer_1"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 115.4 122.88"
                  >
                    <title>up-arrow</title>
                    <path d="M24.94,67.88A14.66,14.66,0,0,1,4.38,47L47.83,4.21a14.66,14.66,0,0,1,20.56,0L111,46.15A14.66,14.66,0,0,1,90.46,67.06l-18-17.69-.29,59.17c-.1,19.28-29.42,19-29.33-.25L43.14,50,24.94,67.88Z" />
                  </svg>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Data;
