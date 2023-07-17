/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  PolylineF,
} from "@react-google-maps/api";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

import { writeMission } from "./functionUtils";

import "./Plan.css";
import { useData } from "./components/context/auth/DataState";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import VehicleSelector from "./components/VehicleSelector";
// const ResponsiveGridLayout = WidthProvider(Responsive);

const Plan = () => {
  const [userLoc, setUserLoc] = useState();
  const [center, setcenter] = useState({ lat: 18.479373, lng: 73.87337 });
  const [activeMarker, setActiveMarker] = useState(null);
  const [libraries] = useState(["places"]);
  const [zoom, setzoom] = useState(15);
  const [map, setMap] = useState(null);
  const [headerItem, setheaderItem] = useState("DEFAULT");
  const { data, client, selectedVehicle } = useData();

  const [tableHeader, settableHeader] = useState([
    "P1",
    "P2",
    "P3",
    "P4",
    "Lat",
    "Lon",
    "Alt",
  ]);

  const [path, setpath] = useState([]);
  const [pathFull, setpathFull] = useState([]);

  useEffect(() => {
    setpath((val) => pathFull.map((val) => ({ lat: val.p5, lng: val.p6 })));
  }, [pathFull]);

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
  const polylineoptions = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: [
      { lat: 37.772, lng: -122.214 },
      { lat: 21.291, lng: -157.821 },
      { lat: -18.142, lng: 178.431 },
      { lat: -27.467, lng: 153.027 },
    ],
    zIndex: 1,
  };

  const addToPathFull = (obj) => {
    setpathFull((current) => [...current, obj]);
  };

  // ✅ Update one or more objects in a state array
  const updatePathFull = (i, attr, val) => {
    setpathFull((current) =>
      current.map((obj, index) => {
        if (index === i) {
          if (attr.startsWith("P")) return { ...obj, [attr]: parseFloat(val) };
          return { ...obj, [attr]: val };
        }

        return obj;
      })
    );
  };

  // ✅ Remove one or more objects from state array
  const removeFromPathFull = (i) => {
    setpathFull((current) =>
      current.filter((obj, index) => {
        if (index !== i) return obj;
      })
    );
  };

  console.log(pathFull);

  const layout = [
    { i: "a", x: 0, y: 0, w: 10, h: 7, minW: 3, minH: 5 },
    { i: "b", x: 10, y: 0, w: 2, h: 3, minW: 1, maxW: 4 },
    { i: "c", x: 0, y: 1, w: 1, h: 3 },
  ];

  return (
    <>
      <div className="plan-main">
        <div className="plan-parent">
          {/* <ResponsiveGridLayout
          className="layout"
          layout={{lg:layout}}
          // cols={12}
          // rowHeight={30}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          // width={1200}
        > */}
          <div className="plan-maps-main">
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
                  map.addListener("click", (mapsMouseEvent) => {
                    console.log(mapsMouseEvent.latLng.toJSON());
                    setpathFull((prev) => [
                      ...prev,
                      {
                        command: "MAV_CMD_NAV_WAYPOINT",
                        p1: 0,
                        p2: 0,
                        p3: 0,
                        p4: null,
                        p5: mapsMouseEvent.latLng.toJSON().lat,
                        p6: mapsMouseEvent.latLng.toJSON().lng,
                        p7: 100,
                      },
                    ]);
                  });
                }}
                center={center ? center : userLoc}
                options={defaultMapOptions}
                mapContainerClassName="plan-gmap"
                onClick={() => setActiveMarker(null)}
              >
                <>
                  <PolylineF
                    onLoad={(x) => console.log(x)}
                    path={path}
                    options={polylineoptions}
                  />
                  {path.map((val, i) => (
                    <MarkerF
                      key={i}
                      position={val}
                      // onClick={(props, marker) => {
                      //   setSelectedElement((prev) => !prev);
                      //   setActiveMarker(marker);
                      // }}
                    />
                  ))}
                  {/* {GPS.lat && GPS.lng && (
            <MarkerF
              position={GPS}
              icon={droneicon}
              onClick={(props, marker) => {
                setSelectedElement((prev) => !prev);
                setActiveMarker(marker);
              }}
            > */}
                  {/* {activeMarker === i && (
          <InfoWindow
            onCloseClick={() => {
              setActiveMarker(null);
            }}
          >
            <div>Updated: {moment(val.timestamp).fromNow()}</div>
          </InfoWindow>
        )} */}
                  {/* </MarkerF> */}
                  {/* )} */}
                </>
              </GoogleMap>
            )}
          </div>
          <div className="right-column">
            <VehicleSelector />
            <Button
              onClick={() => writeMission(client, selectedVehicle, pathFull)}
              variant="contained"
            >
              Write Mission
            </Button>
          </div>
        </div>
        <div className="bottom-area">
          <table id="maintable">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Command</th>
                {headerList[headerItem].map((item, i) => (
                  <th key={i}>{item}</th>
                ))}
                <th>Delete</th>
              </tr>
            </thead>
            <tbody onBlur={() => console.log("Blur")}>
              {pathFull.map((val, i) => (
                <tr key={i} onFocus={() => setheaderItem(val.command)}>
                  <td>
                    {/* Sr No. */}
                    <input type="text" id="cell" value={i + 1} />
                  </td>
                  <td>
                    {/* Command */}
                    <select
                      name="m"
                      id="m"
                      onChange={(e) => {
                        setheaderItem(e.target.value);
                        updatePathFull(i, "command", e.target.value);
                      }}
                    >
                      {missionTypeItems.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {/* Param 1 */}
                    <input
                      type="number"
                      id="cell"
                      value={val.p1}
                      onChange={(e) => updatePathFull(i, "p1", e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Param 2 */}
                    <input
                      type="number"
                      id="cell"
                      value={val.p2}
                      onChange={(e) => updatePathFull(i, "p2", e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Param 3 */}
                    <input
                      type="number"
                      id="cell"
                      value={val.p3}
                      onChange={(e) => updatePathFull(i, "p3", e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Param 4 */}
                    <input
                      type="number"
                      id="cell"
                      value={val.p4}
                      onChange={(e) => updatePathFull(i, "p4", e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Lat */}
                    <input
                      type="number"
                      id="cell"
                      value={val.p5}
                      onChange={(e) => updatePathFull(i, "p5", e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Lng */}
                    <input
                      type="number"
                      id="cell"
                      value={val.p6}
                      onChange={(e) => updatePathFull(i, "p6", e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Alt */}
                    <input
                      type="number"
                      id="cell"
                      value={val.p7}
                      onChange={(e) => updatePathFull(i, "p7", e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Delete */}
                    <button
                      type="text"
                      id="cell"
                      onClick={() => removeFromPathFull(i)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* </ResponsiveGridLayout> */}
      </div>
    </>
  );
};

const headerList = {
  DEFAULT: ["P1", "P2", "P3", "P4", "Latitude", "Longitude", "Altitude"],
  MAV_CMD_NAV_WAYPOINT: [
    "Delay",
    "Accept Raidus",
    "WP Radius",
    "Yaw",
    "Latitude",
    "Longitude",
    "Altitude",
  ],
  MAV_CMD_NAV_TAKEOFF: ["", "", "", "", "", "", "Alt"],
  MAV_CMD_NAV_RETURN_TO_LAUNCH: ["", "", "", "", "", "", ""],
  // MAV_CMD_NAV_LOITER_TIME: ["", "", "", "", "Time", "", ""],
  MAV_CMD_NAV_DELAY: [
    "Seconds (or -1)",
    "Hour UTC (or -1)",
    "Minute UTC (or -1)",
    "Second UTC (or -1)",
    "",
    "",
    "",
  ],
  MAV_CMD_DO_SET_MODE: ["Mode", "", "", "", "", "", ""],
  MAV_CMD_NAV_LAND: ["", "", "", "", "Abort Alt", "Precision Mode", ""],
  MAV_CMD_NAV_LOITER_TURNS: ["", "", "", "Turns", "Time", "", ""],
  MAV_CMD_NAV_LOITER_UNLIM: ["", "", "", "", "Radius", "", ""],
  MAV_CMD_DO_PAYLOAD_PLACE: ["", "", "", "", "Index", "Drop", ""],
  MAV_CMD_SCRIPT_TIME_ACTION: ["", "", "", "", "Time", "Action", ""],
  MAV_CMD_NAV_SPLINE_WAYPOINT: ["", "", "", "", "Yaw", "Unused", ""],
  MAV_CMD_IMAGE_START_CAPTURE: ["", "", "", "", "Interval", "", ""],
  MAV_CMD_CAMERA_SET_ZOOM: ["", "", "", "", "Zoom Level", "", ""],
  MAV_CMD_CAMERA_SET_FOCUS: ["", "", "", "", "Focus Level", "", ""],
  MAV_CMD_VIDEO_START_CAPTURE: ["", "", "", "", "Duration", "Frames", ""],
  MAV_CMD_VIDEO_STOP_CAPTURE: ["", "", "", "", "", "", ""],
  MAV_CMD_DO_AUX_FUNCTION: ["", "", "", "", "Function", "Param1", ""],
  MAV_CMD_DO_CHANGE_SPEED: ["", "", "", "", "Speed Type", "Speed", "Throttle"],
  MAV_CMD_DO_DIGICAM_CONFIGURE: ["", "", "", "", "Mode", "Shutter", "Aperture"],
  MAV_CMD_DO_DIGICAM_CONTROL: ["", "", "", "", "Session", "Zoom", "Step"],
  MAV_CMD_DO_ENGINE_CONTROL: ["", "", "", "", "Engine", "Engage", ""],
  MAV_CMD_DO_GIMBAL_MANAGER_PITCHYAW: ["", "", "", "", "Pitch", "Yaw", "Empty"],
  MAV_CMD_DO_GRIPPER: ["", "", "", "", "Action", "Release", "Force"],
  MAV_CMD_DO_GUIDED_LIMITS: [
    "",
    "",
    "",
    "",
    "Timeout",
    "Absolute Altitude",
    "",
  ],
  MAV_CMD_DO_JUMP: ["", "", "", "Sequence", "Repeat", "", ""],
  MAV_CMD_DO_LAND_START: ["", "", "", "", "Abort Alt", "Precision Mode", ""],
  MAV_CMD_DO_MOUNT_CONTROL: ["", "", "", "", "Pitch", "Roll", "Yaw"],
  MAV_CMD_DO_PARACHUTE: ["", "", "", "Action", "", "", ""],
  MAV_CMD_DO_REPEAT_RELAY: [
    "",
    "",
    "",
    "",
    "Relay",
    "Cycle Time",
    "Cycle Count",
  ],
  MAV_CMD_DO_REPEAT_SERVO: [
    "",
    "",
    "",
    "",
    "Servo Number",
    "Cycle Time",
    "Pulse Width",
  ],
  MAV_CMD_DO_SET_CAM_TRIG_DIST: ["", "", "", "", "Shutter Distance", "", ""],
  MAV_CMD_DO_SET_RELAY: ["", "", "", "", "Relay", "Value", ""],
  MAV_CMD_DO_SET_RESUME_REPEAT_DIST: [
    "",
    "",
    "",
    "",
    "Resume",
    "Delay",
    "Distance",
  ],
  MAV_CMD_DO_SET_ROI: ["", "", "", "", "ROI Mode", "Mission Index", ""],
  MAV_CMD_DO_SET_SERVO: ["", "", "", "", "Servo Number", "PWM", ""],
  MAV_CMD_DO_SPRAYER: [
    "",
    "",
    "",
    "",
    "Spray Rate",
    "Spray Width",
    "Spray Speed",
  ],
  MAV_CMD_DO_WINCH: ["", "", "", "Action", "Length", "Speed", ""],
  MAV_CMD_CONDITION_DISTANCE: ["", "", "", "", "Distance", "Relay", ""],
  MAV_CMD_CONDITION_YAW: ["", "", "", "", "Angle", "Direction", ""],
  UNKNOWN: ["", "", "", "", "", "", ""],
};

const missionTypeItems = [
  { value: "MAV_CMD_NAV_WAYPOINT", name: "WAYPOINT" },
  { value: "MAV_CMD_NAV_TAKEOFF", name: "TAKEOFF" },
  { value: "MAV_CMD_NAV_RETURN_TO_LAUNCH", name: "RETURN_TO_LAUNCH" },
  // { value: "MAV_CMD_NAV_LOITER_TIME", name: "ATTITUDE_TIME" },
  { value: "MAV_CMD_NAV_DELAY", name: "DELAY" },
  { value: "MAV_CMD_DO_SET_MODE", name: "GUIDED_ENABLE" },
  { value: "MAV_CMD_NAV_LAND", name: "LAND" },
  { value: "MAV_CMD_NAV_LOITER_TIME", name: "LOITER_TIME" },
  { value: "MAV_CMD_NAV_LOITER_TURNS", name: "LOITER_TURNS" },
  { value: "MAV_CMD_NAV_LOITER_UNLIM", name: "LOITER_UNLIM" },
  { value: "MAV_CMD_DO_PAYLOAD_PLACE", name: "PAYLOAD_PLACE" },
  { value: "MAV_CMD_SCRIPT_TIME_ACTION", name: "SCRIPT_TIME" },
  { value: "MAV_CMD_NAV_SPLINE_WAYPOINT", name: "SPLINE_WAYPOINT" },
  { value: "MAV_CMD_IMAGE_START_CAPTURE", name: "IMAGE_START_CAPTURE" },
  { value: "MAV_CMD_CAMERA_SET_ZOOM", name: "SET_CAMERA_ZOOM" },
  { value: "MAV_CMD_CAMERA_SET_FOCUS", name: "SET_CAMERA_FOCUS" },
  { value: "MAV_CMD_VIDEO_START_CAPTURE", name: "VIDEO_START_CAPTURE" },
  { value: "MAV_CMD_VIDEO_STOP_CAPTURE", name: "VIDEO_STOP_CAPTURE" },
  { value: "MAV_CMD_DO_AUX_FUNCTION", name: "DO_AUX_FUNCTION" },
  { value: "MAV_CMD_DO_CHANGE_SPEED", name: "DO_CHANGE_SPEED" },
  { value: "MAV_CMD_DO_DIGICAM_CONFIGURE", name: "DO_DIGICAM_CONFIGURE" },
  { value: "MAV_CMD_DO_DIGICAM_CONTROL", name: "DO_DIGICAM_CONTROL" },
  { value: "MAV_CMD_DO_ENGINE_CONTROL", name: "DO_ENGINE_CONTROL" },
  {
    value: "MAV_CMD_DO_GIMBAL_MANAGER_PITCHYAW",
    name: "DO_GIMBAL_MANAGER_PITCHYAW",
  },
  { value: "MAV_CMD_DO_GRIPPER", name: "DO_GRIPPER" },
  { value: "MAV_CMD_DO_GUIDED_LIMITS", name: "DO_GUIDED_LIMITS" },
  { value: "MAV_CMD_DO_JUMP", name: "DO_JUMP" },
  { value: "MAV_CMD_DO_LAND_START", name: "DO_LAND_START" },
  { value: "MAV_CMD_DO_MOUNT_CONTROL", name: "DO_MOUNT_CONTROL" },
  { value: "MAV_CMD_DO_PARACHUTE", name: "DO_PARACHUTE" },
  { value: "MAV_CMD_DO_REPEAT_RELAY", name: "DO_REPEAT_RELAY" },
  { value: "MAV_CMD_DO_REPEAT_SERVO", name: "DO_REPEAT_SERVO" },
  { value: "MAV_CMD_DO_SET_CAM_TRIG_DIST", name: "DO_SET_CAM_TRIG_DIST" },
  { value: "MAV_CMD_DO_SET_RELAY", name: "DO_SET_RELAY" },
  {
    value: "MAV_CMD_DO_SET_RESUME_REPEAT_DIST",
    name: "DO_SET_RESUME_REPEAT_DIST",
  },
  { value: "MAV_CMD_DO_SET_ROI", name: "DO_SET_ROI" },
  { value: "MAV_CMD_DO_SET_SERVO", name: "DO_SET_SERVO" },
  { value: "MAV_CMD_DO_SPRAYER", name: "DO_SPRAYER" },
  { value: "MAV_CMD_DO_WINCH", name: "DO_WINCH" },
  { value: "MAV_CMD_CONDITION_DELAY", name: "CONDITION_DELAY" },
  { value: "MAV_CMD_CONDITION_DISTANCE", name: "CONDITION_DISTANCE" },
  { value: "MAV_CMD_CONDITION_YAW", name: "CONDITION_YAW" },
  { value: "UNKNOWN", name: "UNKNOWN" },
];

export default Plan;
