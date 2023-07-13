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

export function arm(client) {
  client.send(
    JSON.stringify({
      type: "message",
      purpose: "Arm",
    })
  );
}

export function disarm(client) {
  client.send(
    JSON.stringify({
      type: "message",
      purpose: "Disarm",
    })
  );
}

export function takeoff(client, data) {
  client.send(
    JSON.stringify({
      type: "message",
      purpose: "Takeoff",
      data,
    })
  );
}
