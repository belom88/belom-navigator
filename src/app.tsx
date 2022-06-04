import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { DirectionsResult } from "./types/directions-result";
import "./index.css";
import "leaflet/dist/leaflet.css";
import Bounds from "./components/bounds";
import Route from "./components/route";
import { EndPoint, StartPoint } from "./components/points";

export default function App() {
  const [directionsResult, setDirectionsResult] =
    useState<DirectionsResult | null>(null);

  useEffect(() => {
    fetch("/response.json").then((response) => {
      response.json().then((result: DirectionsResult) => {
        setDirectionsResult(result);
      });
    });
  }, []);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={9}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100wh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {directionsResult?.routes.map((route) => (
        <Route key={route.overview_polyline.points} route={route}></Route>
      ))}
      {directionsResult && (
        <StartPoint
          center={[
            directionsResult.waypoints[0].location[1],
            directionsResult.waypoints[0].location[0],
          ]}
          tooltipMessage={directionsResult.waypoints[0].name}
        />
      )}
      {directionsResult && (
        <EndPoint
          center={[
            directionsResult.waypoints[directionsResult.waypoints.length - 1]
              .location[1],
            directionsResult.waypoints[directionsResult.waypoints.length - 1]
              .location[0],
          ]}
          tooltipMessage={
            directionsResult.waypoints[directionsResult.waypoints.length - 1]
              .name
          }
        />
      )}
      <Bounds routes={directionsResult?.routes}></Bounds>
    </MapContainer>
  );
}
