import '@root/global.scss';

import ParkCard from '@components/ParkCard';
import Grid from '@components/Grid';
import DefaultLayout from '@components/page/DefaultLayout';
import { PARKS } from '@data/parks';
import DefaultActionBar from '@root/components/page/DefaultActionBar';
import styles from './ParksPage.module.scss';

export const dynamic = 'force-static';

export default function ParksPage() {
  return (
    <DefaultLayout>
      <DefaultActionBar />
      <Grid className={styles.grid}>
        <h1 className={styles.title}>U.S. National Parks</h1>
        {PARKS.map((park) => (
          <ParkCard key={park.id} park={park} href={`/parks/${park.id}`} />
        ))}
      </Grid>
    </DefaultLayout>
  );
}
