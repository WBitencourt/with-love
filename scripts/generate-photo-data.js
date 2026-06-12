const fs = require('fs');
const path = require('path');

const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);

const MONTHS_PT_MAP = {
  janeiro: '01', fevereiro: '02', março: '03', abril: '04',
  maio: '05', junho: '06', julho: '07', agosto: '08',
  setembro: '09', outubro: '10', novembro: '11', dezembro: '12',
};

function ptDateToSortKey(dateStr) {
  const ptDatePattern = /^(\d{1,2}) de (\S+) de (\d{4})$/;

  const match = dateStr.match(ptDatePattern);

  if (!match) {
    return '0000-00-00';
  }

  const [, day, month, year] = match;

  const mm = MONTHS_PT_MAP[month.toLowerCase()];

  if (!mm) {
    return '0000-00-00';
  }

  return `${year}-${mm}-${day.padStart(2, '0')}`;
}

const photosDir = path.join(__dirname, '../public/photos');
const outputPath = path.join(photosDir, 'photo-data.json');

const existing = fs.existsSync(outputPath)
  ? JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
  : {};

const files = fs.readdirSync(photosDir)
  .filter(f => IMG_EXTS.has(path.extname(f).toLowerCase()));

const entries = [];

for (const file of files) {
  const photoPath = `/photos/${file}`;
  const meta = existing[photoPath] || { date: '', location: '' };

  entries.push({
    path: photoPath,
    date: meta.date,
    location: meta.location,
    sortKey: ptDateToSortKey(meta.date),
  });
}

entries.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

const photoData = {};
for (const entry of entries) {
  photoData[entry.path] = { date: entry.date, location: entry.location };
}

const list = entries.map(e => e.path);

fs.writeFileSync(path.join(photosDir, 'list.json'), JSON.stringify(list, null, 2), 'utf-8');
fs.writeFileSync(outputPath, JSON.stringify(photoData, null, 2), 'utf-8');

console.log(`Done! ${list.length} photos sorted by date (newest first).`);
entries.forEach(e => console.log(`  ${e.sortKey}  ${path.basename(e.path)}`));
