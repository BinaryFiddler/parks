import * as React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  parkCode: string;
  name: string;
}

const Map: React.FC<MapProps> = ({ parkCode, name }) => {
  const [data, setData] = React.useState<any | null>(null);

  React.useEffect(() => {
    fetch(`/boundaries/${parkCode}.geojson`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [parkCode]);

  const center: LatLngExpression = data?.properties?.center || [37.8, -96];

  return (
    <MapContainer style={{ height: '450px', width: '100%' }} center={center} zoom={7} scrollWheelZoom={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data && <GeoJSON data={data} pathOptions={{ color: 'red' }} />}
    </MapContainer>
  );
};

export default Map;
