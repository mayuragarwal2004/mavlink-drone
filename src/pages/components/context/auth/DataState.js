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
    x: "abc",
  });
  const [selectedVehicle, setselectedVehicle] = useState();
  const [data, setdata] = useState({});
  // const [currentUserRole, setcurrentUserRole] = useState();

  console.log({ serverInfo });

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
      else if (dataFromServer.message_type === "SystemInfo")
        setserverInfo((prev) => ({
          ...prev,
          ports: dataFromServer.ports,
        }));
    };

    return () => {
      //   second;
    };
  }, []);

  console.log(data);

  const value = {
    data,
    serverInfo,
    client,
    selectedVehicle,
    setselectedVehicle,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export function useData() {
  return useContext(AuthContext);
}

export default DataState;
