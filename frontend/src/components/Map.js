import React from "react";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import mapboxgl from "mapbox-gl";
import { useMobile } from "../context/MobileContext";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_KEY = process.env.REACT_APP_MAPBOX_KEY;

function Map() {
  const mobile = useMobile();
  const Map = ReactMapboxGl({
    accessToken: MAPBOX_KEY,
    scrollZoom: false,
  });
  mapboxgl.workerClass =
    // eslint-disable-next-line import/no-webpack-loader-syntax
    require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

  const center = [-87.681559, 42.04616];
  return (
    <Map
      containerStyle={{
        height: mobile ? "350px" : "400px",
        width: mobile ? "95vw" : "35vw",
        borderRadius: "2px",
      }}
      center={center}
      zoom={[16]}
    >
      <Marker coordinates={center} anchor="bottom">
        <svg
          width="50"
          height="50"
          viewBox="0 0 20 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 10C19 17 10 23 10 23C10 23 1 17 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1C12.3869 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10Z"
            fill="#d21e1e"
            stroke="#861109"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
            fill="white"
            stroke="#861109"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Marker>
    </Map>
  );
}

export default Map;
