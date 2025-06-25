import styles from '@components/ParkCard.module.scss';
import Card from '@components/Card';
import Grid from '@components/Grid';
import Row from '@components/Row';
import Text from '@components/Text';
import Badge from '@components/Badge';
import * as React from 'react';
import type { Park } from '@data/parks';

interface ParkCardProps {
  park: Park;
}

const ParkCard: React.FC<ParkCardProps> = ({ park }) => {
  const heroImage = park.memories?.find((m) => m.image)?.image;

  return (
    <Card title={park.name} style={{ marginBottom: '1rem' }}>
      <Grid>
        {heroImage && (
          <Row>
            <img src={heroImage} alt={park.name} className={styles.image} />
          </Row>
        )}
        <Row>
          <Text>{park.description}</Text>
        </Row>
        <Row>
          {park.states.map((state) => (
            <Badge key={state}>{state}</Badge>
          ))}
        </Row>
        {park.visits && park.visits.length > 0 && (
          <Row>
            {park.visits.map((visit, i) => (
              <Badge key={i} style={{ marginLeft: i ? '0.5rem' : 0 }}>
                {visit.start} - {visit.end}
              </Badge>
            ))}
          </Row>
        )}
        {park.memories && park.memories.length > 0 && (
          <Row>
            <ul className={styles.memories}>
              {park.memories.map((m, i) => (
                <li key={i}>
                  {m.image && (
                    <img
                      src={m.image}
                      alt={m.text}
                      className={styles.memoryImage}
                    />
                  )}
                  {m.text}
                </li>
              ))}
            </ul>
          </Row>
        )}
      </Grid>
    </Card>
  );
};

export default ParkCard;
