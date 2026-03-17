const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = path.join(__dirname, '..', 'public', 'photos');
const EXTENSIONS = /\.(jpg|jpeg|png|heic)$/i;

function getImageFiles(dir) {
  const names = fs.readdirSync(dir);
  return names.filter((name) => EXTENSIONS.test(name)).map((name) => path.join(dir, name));
}

function parseDateFromFilename(filePath) {
  const name = path.basename(filePath, path.extname(filePath));
  const imgMatch = name.match(/^IMG_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/i);
  if (imgMatch) {
    const [, y, m, d, h, min, s] = imgMatch;
    return new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min), Number(s));
  }
  const timestampMatch = name.match(/^(\d{10,13})$/);
  if (timestampMatch) {
    let ts = Number(timestampMatch[1]);
    if (ts < 1e12) ts *= 1000;
    return new Date(ts);
  }
  const nocropMatch = name.match(/nocrop_(\d{10,13})/);
  if (nocropMatch) {
    let ts = Number(nocropMatch[1]);
    if (ts < 1e12) ts *= 1000;
    return new Date(ts);
  }
  return null;
}

function formatFileName(date, ext, suffix = '') {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  const base = `${d}-${m}-${y}_${h}-${min}-${s}`;
  return suffix ? `${base}-${suffix}${ext}` : `${base}${ext}`;
}

async function getDateForFile(filePath) {
  const exifr = require('exifr');
  try {
    const data = await exifr.parse(filePath, ['DateTimeOriginal', 'CreateDate', 'ModifyDate']);
    const date = data?.DateTimeOriginal ?? data?.CreateDate ?? data?.ModifyDate;
    if (date) return date instanceof Date ? date : new Date(date);
  } catch (_) {}
  const fromName = parseDateFromFilename(filePath);
  if (fromName) return fromName;
  const stat = fs.statSync(filePath);
  return stat.mtime;
}

async function convertHeicToJpg(heicPath) {
  const convert = require('heic-jpg-exif');
  const dir = path.dirname(heicPath);
  const base = path.basename(heicPath, path.extname(heicPath));
  const outPath = path.join(dir, `${base}.jpg`);
  try {
    await convert(heicPath, outPath, 1);
    fs.unlinkSync(heicPath);
    return outPath;
  } catch (err) {
    console.warn(`Could not convert HEIC to JPG (keeping HEIC): ${path.basename(heicPath)}`, err.message);
    return heicPath;
  }
}

async function main() {
  const files = getImageFiles(PHOTOS_DIR);
  const heicFiles = files.filter((f) => /\.heic$/i.test(f));
  let workFiles = files.filter((f) => !/\.heic$/i.test(f));

  for (const heicPath of heicFiles) {
    const result = await convertHeicToJpg(heicPath);
    if (result !== heicPath) workFiles.push(result);
    else workFiles.push(heicPath);
  }

  const withDates = await Promise.all(
    workFiles.map(async (filePath) => ({
      filePath,
      date: await getDateForFile(filePath),
    }))
  );

  withDates.sort((a, b) => b.date.getTime() - a.date.getTime());

  const nameCount = new Map();
  const renames = withDates.map(({ filePath, date }) => {
    const ext = path.extname(filePath).toLowerCase();
    const key = formatFileName(date, '');
    const count = nameCount.get(key) ?? 0;
    nameCount.set(key, count + 1);
    const suffix = count === 0 ? '' : count;
    const newName = formatFileName(date, ext, suffix);
    return { filePath, newName };
  });

  const tempDir = path.join(PHOTOS_DIR, '__temp_rename');
  fs.mkdirSync(tempDir, { recursive: true });
  const tempPaths = [];
  try {
    for (let i = 0; i < renames.length; i++) {
      const { filePath, newName } = renames[i];
      const tempPath = path.join(tempDir, `f${i}${path.extname(filePath)}`);
      fs.renameSync(filePath, tempPath);
      tempPaths.push({ tempPath, newName });
    }
    for (const { tempPath, newName } of tempPaths) {
      const dest = path.join(PHOTOS_DIR, newName);
      fs.renameSync(tempPath, dest);
    }
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true });
    } catch (_) {}
  }

  const list = tempPaths.map(({ newName }) => `/photos/${newName}`);
  const listPath = path.join(PHOTOS_DIR, 'list.json');
  fs.writeFileSync(listPath, JSON.stringify(list, null, 2), 'utf8');

  console.log('Renamed', renames.length, 'files (newest first). List written to public/photos/list.json');
  list.forEach((p, i) => console.log(`${i + 1}. ${p}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
