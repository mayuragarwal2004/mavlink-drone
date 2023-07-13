import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Actions from "./dataRightPanelComponents/Actions";
// import SwipeableViews from 'react-swipeable-views';
import Quick from "./dataRightPanelComponents/Quick";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children }
    </div>
  );
}

const RightPanelComponent = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  console.log(value);

  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
        sx={{ color: "white" }}
      >
        <Tab label="Quick" sx={{ color: "white" }} />
        <Tab label="Actions" sx={{ color: "white" }} />
        <Tab label="Messages" sx={{ color: "white" }} />
        <Tab label="Pre-Flight" sx={{ color: "white" }} />
        <Tab label="Gauges" sx={{ color: "white" }} />
        <Tab label="Drone ID" sx={{ color: "white" }} />
        <Tab label="Status" sx={{ color: "white" }} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Quick />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Actions />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
};

export default RightPanelComponent;
