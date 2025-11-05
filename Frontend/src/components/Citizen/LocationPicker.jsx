import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix for leaflet default icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LocationMarker({ onLocationSelect, selectedLocation }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      setPosition({
        lat: Number(selectedLocation.lat),
        lng: Number(selectedLocation.lng),
      });
    }
  }, [selectedLocation]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({ onPick, selectedLocation }) {
  return (
    <div className="w-full h-64 rounded-md overflow-hidden shadow-inner mb-4">
      <MapContainer
        center={
          selectedLocation && selectedLocation.lat && selectedLocation.lng
            ? [selectedLocation.lat, selectedLocation.lng]
            : [7.8731, 80.7718]
        } // Center Sri Lanka default or selected location
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker onLocationSelect={onPick} selectedLocation={selectedLocation} />
      </MapContainer>
    </div>
  );
}
