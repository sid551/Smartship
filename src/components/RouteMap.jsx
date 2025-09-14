// src/components/RouteMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

function RouteMap({ originCoords, destinationCoords }) {
  if (!originCoords || !destinationCoords) return null;

  const center = [
    (originCoords[0] + destinationCoords[0]) / 2,
    (originCoords[1] + destinationCoords[1]) / 2
  ];

  return (
    <div style={{ height: "400px", width: "100%", marginTop: "1rem", borderRadius: "12px", overflow: "hidden" }}>
      <MapContainer center={center} zoom={3} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={originCoords} />
        <Marker position={destinationCoords} />
        <Polyline positions={[originCoords, destinationCoords]} color="blue" weight={4} />
      </MapContainer>
    </div>
  );
}

export default RouteMap;
