import { MapContainer, TileLayer } from 'react-leaflet';

const MapView = () => {
  const defaultCenter = [6.9271, 79.8612]; // Colombo (change if needed)

  return (
    <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
      <MapContainer center={defaultCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
