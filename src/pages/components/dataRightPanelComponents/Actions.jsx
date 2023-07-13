import React from "react";
import { takeoff, arm, disarm } from "../../functionUtils";
import { useData } from "../../components/context/auth/DataState";

const Actions = () => {
  const { data, client } = useData();
  return (
    <div>
      <button onClick={() => takeoff(client, { alt: 10 })}>Take Off</button>
      {/* <button onClick={()=>takeoff(client)}>Start Mission</button> */}
    </div>
  );
};

export default Actions;
