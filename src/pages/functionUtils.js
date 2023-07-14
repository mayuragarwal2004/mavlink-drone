export function requestConnect (client, {connectType, baud}) {
  client.send(
    JSON.stringify({
      type: "message",
      purpose: "ConnectVehicle",
      port: connectType,
      baud
    })
    );
  };
  
  export function portUpdate (client) {
    client.send(
      JSON.stringify({
        type: "message",
        purpose: "PortUpdate",
      })
      );
    };
    
    export function arm(client, sysid) {
      client.send(
        JSON.stringify({
          type: "message",
          purpose: "Arm",
          systemid: sysid,
    })
  );
}

export function disarm(client, sysid) {
  client.send(
    JSON.stringify({
      type: "message",
      purpose: "Disarm",
      systemid: sysid,
    })
  );
}

export function takeoff(client, sysid, data) {
  client.send(
    JSON.stringify({
      type: "message",
      purpose: "Takeoff",
      systemid: sysid,
      data,
    })
  );
}
