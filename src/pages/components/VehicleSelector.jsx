import React from "react";
import { useData } from "./context/auth/DataState";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const VehicleSelector = () => {
  const { data, selectedVehicle, setselectedVehicle } = useData();
  
  const handleVehicleChange = (event) => {
    setselectedVehicle(event.target.value);
  };

  return (
    <>
      <FormControl size="small" variant="filled" sx={{ m: 1, minWidth: 90 }}>
        <InputLabel
          id="demo-simple-select-filled-label"
          sx={{
            color: "white",
            borderColor: "white",
          }}
        >
          Vehicle
        </InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={selectedVehicle}
          onChange={handleVehicleChange}
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
          {Object.keys(data).map((item, index) => (
            <MenuItem key={index} value={item}>
              {data[item]?.systemid}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default VehicleSelector;
