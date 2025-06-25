import '@root/global.scss';

import DefaultLayout from '@components/page/DefaultLayout';
import Grid from '@components/Grid';
import Row from '@components/Row';
import Text from '@components/Text';
import Badge from '@components/Badge';
import Card from '@components/Card';
import Map from '@components/Map';
import { PARKS } from '@data/parks';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return PARKS.map((park) => ({ id: park.id }));
}

export default function ParkPage({ params }) {
  const park = PARKS.find((p) => p.id === params.id);
  if (!park) {
    return (
      <DefaultLayout previewPixelSRC="/template-app-icon.png">
        <Grid>
          <Row>Park not found.</Row>
        </Grid>
      </DefaultLayout>
    );
  }

  const heroImage = park.memories?.find((m) => m.image)?.image;

  return (
    <DefaultLayout previewPixelSRC="/template-app-icon.png">
      <Grid>
        <Row>
          <h1>{park.name}</h1>
        </Row>
        {heroImage && (
          <Row>
            <img src={heroImage} alt={park.name} style={{ width: '100%', borderRadius: '4px' }} />
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
            <Card title="Past Visits">
              <Grid>
                {park.visits.map((visit, i) => (
                  <Row key={i}>
                    <Badge>{visit.start} - {visit.end}</Badge>
                  </Row>
                ))}
              </Grid>
            </Card>
          </Row>
        )}
        <Row>
          <Map query={park.name} />
        </Row>
        {park.memories && park.memories.length > 0 && (
          <Row>
            <Card title="Memories">
              <ul className="memories">
                {park.memories.map((m, i) => (
                  <li key={i}>
                    {m.image && (
                      <img src={m.image} alt={m.text} style={{ width: '100%', borderRadius: '4px', marginBottom: '4px' }} />
                    )}
                    {m.text}
                  </li>
                ))}
              </ul>
            </Card>
          </Row>
        )}
      </Grid>
    </DefaultLayout>
  );
}

