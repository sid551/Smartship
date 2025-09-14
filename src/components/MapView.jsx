import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-control-geocoder";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

function RemoveZoomControl() {
  const map = useMap();

  useEffect(() => {
    // Forcefully remove zoom control (even if re-added)
    if (map.zoomControl) {
      map.zoomControl.remove();
    }
  }, [map]);

  return null;
}

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
});

// Add fullscreen control to a clean position (e.g., bottomright)
function AddFullscreenControl() {
  const map = useMap();

  useEffect(() => {
    const control = new L.Control.Fullscreen({
      position: "bottomright", // <-- key change here
    });
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
}

function MapView({ originCoords, destinationCoords }) {
  const origin = [originCoords.lat, originCoords.lon];
  const destination = [destinationCoords.lat, destinationCoords.lon];
  const center = [
    (originCoords.lat + destinationCoords.lat) / 2,
    (originCoords.lon + destinationCoords.lon) / 2,
  ];

  return (
    <div className="map-box" style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={true}
        zoomControl={false}
        whenCreated={(map) => {
          map.zoomControl.remove(); // ← force remove zoom control
        }} // Disable default zoom control
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />
        <Marker position={origin}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
            Origin
          </Tooltip>
        </Marker>
        <Marker position={destination}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
            Destination
          </Tooltip>
        </Marker>
        <Polyline positions={[origin, destination]} color="blue" />
        {/* ✅ Fullscreen control at bottom right (no overlap) */}
        <AddFullscreenControl />
      </MapContainer>
    </div>
  );
}

export default MapView;
