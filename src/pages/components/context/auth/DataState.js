// import React from "react";
import React, { useContext, useState, useEffect } from "react";
import AuthContext from "./DataContext";
import { w3cwebsocket as W3CWebSocket } from "websocket";

// const client = new W3CWebSocket("ws://"+process.env.REACT_APP_BACKEND_URL);
// const client = new W3CWebSocket("ws://websockettrial.mayurapro.repl.co");
const client = new W3CWebSocket("ws://127.0.0.1:8000");

const DataState = (props) => {
  const [serverInfo, setserverInfo] = useState({
    ports: [],
  });
  const [data, setdata] = useState({
    1: {
      message_type: "vehicle_data",
      systemid: 1,
      connection: "COM4",
      GPS_RAW_INT: {
        lat: null,
        lng: null,
        alt: null,
        eph: null,
        epv: null,
        satellites_visible: null,
        fix_type: null,
      },
      GLOBAL_POSITION_INT: {
        lat: null,
        lng: null,
        alt: null,
        vx: null,
        vy: null,
        vz: null,
      },
      ATTITUDE: {
        roll: 0,
        pitch: 0,
        yaw: 0,
        rollspeed: 0,
        pitchspeed: 0,
        yawspeed: 0,
      },
      Battery: { current: 0, level: 0, voltage: 0 },
      SYS_STATUS: { current: null, level: null, voltage: null },
      EKF_STATUS_REPORT: {
        ekf_poshorizabs: false,
        ekf_constposmode: false,
        ekf_predposhorizabs: false,
      },
      HEARTBEAT: {
        flightmode: "AUTO",
        armed: false,
        system_status: null,
        autopilot_type: null,
        vehicle_type: null,
      },
      VFR_HUD: { heading: null, groundspeed: null, airspeed: null },
      RANGEFINDER: { rngfnd_voltage: null, rngfnd_distance: null },
      MOUNT_STATUS: { mount_pitch: null, mount_roll: null, mount_yaw: null },
      AUTOPILOT_VERSION: {
        capabilities: null,
        raw_version: null,
        autopilot_version_msg_count: 0,
      },
    },
  });
  // const [currentUserRole, setcurrentUserRole] = useState();

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.message_type === "vehicle_data")
        setdata((prev) => ({
          ...prev,
          [dataFromServer.systemid]: { ...dataFromServer },
        }));
    };

    return () => {
      //   second;
    };
  }, []);

  console.log(data);

  const value = { data, client };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export function useData() {
  return useContext(AuthContext);
}

export default DataState;
