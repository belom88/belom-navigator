import { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { DirectionsResult } from "./types/directions-result";
import "./index.css";
import "leaflet/dist/leaflet.css";
import LeafletBounds from "./components/leaflet/leaflet-bounds";
import Route from "./components/leaflet/leaflet-route";
import RoutePanel from "./components/route-panel/route-panel";
import LeafletEdgePoints from "./components/leaflet/leaflet-edge-points";

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
    <>
      <MapContainer
        center={[0, 0]}
        zoom={9}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100vw" }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright"></ZoomControl>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {directionsResult?.routes.map((route) => (
          <Route key={route.overview_polyline.points} route={route}></Route>
        ))}
        {directionsResult && (
          <LeafletEdgePoints waypoints={directionsResult.waypoints} />
        )}
        <LeafletBounds routes={directionsResult?.routes} />
      </MapContainer>
      <RoutePanel routes={directionsResult?.routes}></RoutePanel>
    </>
  );
}
