import React from "react";
import { useData } from "../context/auth/DataState";
import "./Quick.css";

import Grid from "@mui/material/Grid";

const Quick = () => {
  const { data, client } = useData();
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} className="quick-grid-item">
        <div>
          <div className="heading">Altitude (m)</div>
          <div className="value">{data?.GLOBAL_POSITION_INT?.alt || 0.0}</div>
        </div>
      </Grid>
      <Grid item xs={6} className="quick-grid-item">
        <div>
          <div className="heading">GroundSpeed(m/s)</div>
          <div className="value">{data?.VFR_HUD?.groundspeed || 0.0}</div>
        </div>
      </Grid>
      <Grid item xs={6} className="quick-grid-item">
        <div>
          <div className="heading">Dist to WP</div>
          <div className="value">0.00</div>
        </div>
      </Grid>
      <Grid item xs={6} className="quick-grid-item">
        <div>
          <div className="heading">Yaw (deg)</div>
          <div className="value">{data?.ATTITUDE?.yaw || 0.0}</div>
        </div>
      </Grid>
      <Grid item xs={6} className="quick-grid-item">
        <div>
          <div className="heading">Vertical Speed (m/s)</div>
          <div className="value">0.00</div>
        </div>
      </Grid>
      <Grid item xs={6} className="quick-grid-item  ">
        <div>
          <div className="heading">DistToMav</div>
          <div className="value">0.00</div>
        </div>
      </Grid>
    </Grid>
  );
};

export default Quick;
