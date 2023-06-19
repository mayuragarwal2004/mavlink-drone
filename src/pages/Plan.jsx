/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  PolygonF,
  PolylineF,
} from "@react-google-maps/api";
import CircularProgress from "@mui/material/CircularProgress";
import "./Plan.css";

const Plan = () => {
  const [userLoc, setUserLoc] = useState();
  const [center, setcenter] = useState({ lat: 18.479373, lng: 73.87337 });
  const [activeMarker, setActiveMarker] = useState(null);
  const [libraries] = useState(["places"]);
  const [zoom, setzoom] = useState(15);
  const [map, setMap] = useState(null);

  const [path, setpath] = useState([]);
  const [pathFull, setpathFull] = useState([]);

  useEffect(() => {
    setpath((val) => pathFull.map((val) => ({ lat: val.lat, lng: val.lng })));
  }, [pathFull]);

  const writeMission = () => {
    const postData = { pathFull };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    };
    fetch("/api/writemission", requestOptions).then((response) =>
      response.json()
    );
  };

  const callBackendAPI = async () => {
    const response = await fetch("/api");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

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
          return { ...obj, [attr]: parseFloat(val) };
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

  return (
    <>
      <div className="plan-main">
        <div className="plan-parent">
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
                      { ...mapsMouseEvent.latLng.toJSON(), alt: 100 },
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
            <button onClick={writeMission}>Write Mission</button>
          </div>
        </div>
        <div className="bottom-area">
          <table id="maintable">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Type</th>
                <th>Alt</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {pathFull.map((val, i) => (
                <tr key={i}>
                  <td>
                    {/* Sr No. */}
                    <input type="text" id="cell" value={i + 1} />
                  </td>
                  <td>
                    {/* Type */}
                    <select
                      name="m"
                      id="m"
                      defaultValue={"WAYPOINT"}
                      onChange={() => console.log()}
                    >
                      <option value="MORE OPTIONS">MORE OPTIONS</option>
                      <option value="WAYPOINT">WAYPOINT</option>
                    </select>
                  </td>
                  <td>
                    {/* Alt */}
                    <input
                      type="number"
                      id="cell"
                      value={val.alt}
                      onChange={(e) => updatePathFull(i, "alt", e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Lat */}
                    <input
                      type="number"
                      id="cell"
                      value={val.lat}
                      onChange={(e) => updatePathFull(i, "lat", e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Lng */}
                    <input
                      type="number"
                      id="cell"
                      value={val.lng}
                      onChange={(e) => updatePathFull(i, "lng", e.target.value)}
                    />
                  </td>
                  <td>
                    {/* Lng */}
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
      </div>
    </>
  );
};

export default Plan;
