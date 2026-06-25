const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function updateAssetRefs(content) {
  return content
    .replace(/water%20balloon%20filling%20bottle\.png/g, 'water-balloon-filling-bottle.webp')
    .replace(/assets\/([^."'`\s]+)\.png/g, 'assets/$1.webp');
}

function updateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = updateAssetRefs(content);
  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    console.log(`Updated ${path.relative(root, filePath)}`);
  }
}

updateFile(path.join(root, 'index.html'));
updateFile(path.join(root, 'tools', 'generate-pages.js'));

console.log('Done. Run node tools/generate-pages.js to refresh HTML pages.');
