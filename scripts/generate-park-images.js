const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'data', 'parks.ts'), 'utf8');
const parkRegex = /{[^}]*id:\s*'([^']+)'[^}]*name:\s*(?:'([^']+)'|"([^"]+)")[^}]*description:\s*(['"])(.*?)\4[^}]*}/gs;

const emojiMap = [
  [/coast|beach|island|ocean|shore/i, '🌊'],
  [/desert|dune|cactus|saguaro/i, '🏜️'],
  [/arch|bridge/i, '🌉'],
  [/canyon/i, '🏞️'],
  [/volcano/i, '🌋'],
  [/glacier|ice/i, '🏔️'],
  [/forest|wood|jungle|rainforest|redwood|sequoia/i, '🌲'],
  [/mountain|peak|cliff/i, '⛰️'],
  [/river|lake|wetland|swamp/i, '🏞️'],
  [/reef/i, '🐠'],
  [/cave/i, '🕳️'],
];

function pickEmoji(desc) {
  for (const [re, e] of emojiMap) {
    if (re.test(desc)) return e;
  }
  return '🏞️';
}

const outDir = path.join(__dirname, '..', 'public', 'park-images');
fs.mkdirSync(outDir, { recursive: true });

let match;
while ((match = parkRegex.exec(src))) {
  const id = match[1];
  const name = match[2] || match[3];
  const desc = match[5];
  const emoji = pickEmoji(desc);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <rect width="100%" height="100%" fill="#e2e8f0" />
  <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-size="72">${emoji}</text>
  <text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="#1a202c">${name}</text>
</svg>`;
  fs.writeFileSync(path.join(outDir, `${id}.svg`), svg);
}
