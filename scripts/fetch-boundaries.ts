const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_URL = process.env.NPS_BOUNDARIES_URL || 'https://opendata.arcgis.com/datasets/nps-boundaries.geojson';
const LOCAL_FILE = process.env.NPS_BOUNDARIES_FILE || path.join(__dirname, '..', 'data', 'nps_boundary.geojson');

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
  let raw: string;
  if (LOCAL_FILE && fs.existsSync(LOCAL_FILE)) {
    console.log(`Reading local GeoJSON from ${LOCAL_FILE}`);
    raw = fs.readFileSync(LOCAL_FILE, 'utf8');
  } else {
    console.log(`Downloading boundary data from ${DATA_URL}`);
    raw = await download(DATA_URL);
  }
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
  console.error('Failed to fetch boundaries:', err.message);
  console.error('If network access is blocked, set NPS_BOUNDARIES_FILE to a downloaded GeoJSON.');
  process.exit(1);
});
