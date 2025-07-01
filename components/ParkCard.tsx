import styles from '@components/ParkCard.module.scss';
import Badge from '@components/Badge';
import * as React from 'react';
import type { Park } from '@data/parks';

interface ParkCardProps {
  park: Park;
  href?: string;
}

const ParkCard: React.FC<ParkCardProps> = ({ park, href }) => {
  const heroImage = park.image ?? park.memories?.find((m) => m.image)?.image;

  return (
    <a href={href} className={styles.card}>
      <img src={heroImage} alt={park.name} className={styles.image} />
      <h3 className={styles.title}>{park.name}</h3>
      <div className={styles.badges}>
        {park.states.map((state) => (
          <Badge key={state}>{state}</Badge>
        ))}
      </div>
      <p className={styles.description}>{park.description}</p>
    </a>
  );
};

export default ParkCard;
