import styles from '@components/Map.module.scss';
import * as React from 'react';

interface MapProps {
  query: string;
}

const Map: React.FC<MapProps> = ({ query }) => {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return <iframe className={styles.map} src={src} loading="lazy" />;
};

export default Map;

