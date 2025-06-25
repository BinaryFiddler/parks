import fs from 'fs';
import path from 'path';
import https from 'https';

const DATA_URL = 'https://opendata.arcgis.com/datasets/nps-boundaries.geojson';

function download(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

async function main() {
  const raw = await download(DATA_URL);
  const geo = JSON.parse(raw);
  for (const feature of geo.features) {
    const code = feature.properties?.UNIT_CODE?.toLowerCase();
    if (!code) continue;
    const file = path.join(__dirname, '..', 'public', 'boundaries', `${code}.geojson`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(feature));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
