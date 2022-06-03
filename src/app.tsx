import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { DirectionsResult } from "./types/directions-result";
import "./index.css";
import "leaflet/dist/leaflet.css";

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
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100vh", width: "100wh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
