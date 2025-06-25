import '@root/global.scss';

import ParkCard from '@components/ParkCard';
import Grid from '@components/Grid';
import Row from '@components/Row';
import DefaultLayout from '@components/page/DefaultLayout';
import { PARKS } from '@data/parks';

export const dynamic = 'force-static';

export default function ParksPage() {
  return (
    <DefaultLayout previewPixelSRC="/template-app-icon.png">
      <Grid>
        <Row>
          <h1>U.S. National Parks</h1>
        </Row>
      </Grid>
      <Grid>
        {PARKS.map((park) => (
          <ParkCard key={park.id} park={park} href={`/parks/${park.id}`} />
        ))}
      </Grid>
    </DefaultLayout>
  );
}
