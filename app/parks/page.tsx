import '@root/global.scss';

import ParkCard from '@components/ParkCard';
import Grid from '@components/Grid';
import DefaultLayout from '@components/page/DefaultLayout';
import { PARKS } from '@data/parks';
import styles from './ParksPage.module.scss';
import DefaultActionBar from '@root/components/page/DefaultActionBar';

export const dynamic = 'force-static';

export default function ParksPage() {
  return (
    <DefaultLayout>
      {/* <DefaultActionBar /> */}
      <h1 style={{ margin: 16 }}>National Parks of the United States</h1>

      <Grid className={styles.grid}>
        {PARKS.map((park) => (
          <ParkCard key={park.id} park={park} href={`/parks/${park.id}`} />
        ))}
      </Grid>
    </DefaultLayout>
  );
}
