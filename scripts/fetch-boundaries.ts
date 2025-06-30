const fs = require('fs');
const path = require('path');

const LOCAL_FILE = process.env.NPS_BOUNDARIES_FILE || path.join(__dirname, '..', 'data', 'nps_boundary.geojson');

async function main() {
  let raw: string;

  console.log(`Reading local GeoJSON from ${LOCAL_FILE}`);
  raw = fs.readFileSync(LOCAL_FILE, 'utf8');

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
  process.exit(1);
});
