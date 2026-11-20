import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const foldersToCopy = [
  'assets',
  'fonts'
];

for (const folder of foldersToCopy) {
  const src = path.join(rootDir, folder);
  const dest = path.join(distDir, folder);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`Copied ${folder} to dist/${folder}`);
  }
}

// Copy public directory files to dist root
const publicDir = path.join(rootDir, 'public');
if (fs.existsSync(publicDir)) {
  const files = fs.readdirSync(publicDir);
  for (const file of files) {
    const src = path.join(publicDir, file);
    const dest = path.join(distDir, file);
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`Copied public/${file} to dist/${file}`);
  }
}

console.log('Dist sync complete!');
