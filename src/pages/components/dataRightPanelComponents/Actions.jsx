import React from "react";
import { takeoff, arm, disarm } from "../../functionUtils";
import { useData } from "../../components/context/auth/DataState";
import Button from "@mui/material/Button";

const Actions = () => {
  const { data, client, selectedVehicle } = useData();
  return (
    <div>
      <Button
        onClick={() => takeoff(client, selectedVehicle, { alt: 10 })}
        variant="contained"
      >
        Take Off
      </Button>
      {/* <button onClick={() => takeoff(client, { alt: 10 })}>Take Off</button> */}
      {/* <button onClick={()=>takeoff(client)}>Start Mission</button> */}
    </div>
  );
};

export default Actions;
