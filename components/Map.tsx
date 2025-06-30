'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet';
import { center as turfCenter } from '@turf/turf';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });

const GeoJSON = dynamic(() => import('react-leaflet').then((mod) => mod.GeoJSON), { ssr: false });

interface MapProps {
  parkCode: string;
  name: string;
}

const Map: React.FC<MapProps> = ({ parkCode, name }) => {
  const [data, setData] = React.useState<any | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (!isClient) return;

    fetch(`/boundaries/${parkCode}.geojson`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [parkCode, isClient]);

  // Don't render on server side
  if (!isClient) {
    return <div style={{ height: '450px', width: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>;
  }

  // Compute center using Turf.js if data is available
  let center: LatLngExpression = [37.8, -96]; // Default center (US)

  if (data) {
    try {
      const centerPoint = turfCenter(data);
      const [lng, lat] = centerPoint.geometry.coordinates;
      center = [lat, lng];
    } catch (error) {
      console.warn('Failed to compute center with Turf.js, using default center:', error);
      // Fall back to properties center if available
      center = data?.properties?.center || [37.8, -96];
    }
  }

  return (
    <MapContainer style={{ height: '450px', width: '100%' }} center={center} zoom={8} scrollWheelZoom={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data && <GeoJSON data={data} pathOptions={{ color: 'red' }} />}
    </MapContainer>
  );
};

export default Map;
