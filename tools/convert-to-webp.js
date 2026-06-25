const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assetsDir = path.join(__dirname, '..', 'assets');

/** @type {Record<string, { maxWidth?: number, maxHeight?: number, quality?: number, outName?: string }>} */
const presets = {
  'logo.png': { maxWidth: 800, quality: 90 },
  'product-launcher.png': { maxWidth: 1000, quality: 85 },
  'product-cannon.png': { maxWidth: 1000, quality: 85 },
  'product-beast-mega-launcher.png': { maxWidth: 1000, quality: 85 },
  'product-bomber-pack.png': { maxWidth: 800, quality: 85 },
  'product-beast-pack.png': { maxWidth: 800, quality: 85 },
  'product-targets.png': { maxWidth: 800, quality: 85 },
  'action-shot-college-water-baloon-fight.png': { maxWidth: 1200, quality: 82 },
  'kid-with-water-balloons.png': { maxWidth: 1200, quality: 82 },
  'slingking_action_shot_teens_water_baloon_fight.png': { maxWidth: 1200, quality: 82 },
  'as-seen-on-david-letterman.png': { maxWidth: 1200, quality: 82 },
  'us-army-using-sling-king.png': { maxWidth: 1280, quality: 82 },
  'slingking-1988.png': { maxWidth: 900, quality: 85 },
  'field-tested-beast.png': { maxWidth: 1200, quality: 82 },
  'water balloon filling bottle.png': {
    maxWidth: 400,
    quality: 85,
    outName: 'water-balloon-filling-bottle.webp',
  },
  'Miami_Heat_logo.png': { maxHeight: 256, quality: 85 },
  'houston-rockets-logo-transparent.png': { maxHeight: 256, quality: 85 },
  'Dayton_Dragons_logo.png': { maxHeight: 256, quality: 85 },
  'National_Hot_Rod_Association_Logo.png': { maxHeight: 256, quality: 85 },
};

function scaleFilter({ maxWidth, maxHeight }) {
  if (maxWidth && maxHeight) {
    return `scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease`;
  }
  if (maxWidth) return `scale='min(${maxWidth},iw)':-2`;
  if (maxHeight) return `scale=-2:'min(${maxHeight},ih)'`;
  return null;
}

function convertFile(fileName) {
  const input = path.join(assetsDir, fileName);
  if (!fs.existsSync(input)) return null;

  const preset = presets[fileName] || { maxWidth: 1200, quality: 82 };
  const outName = preset.outName || `${path.parse(fileName).name}.webp`;
  const output = path.join(assetsDir, outName);
  const filter = scaleFilter(preset);

  const args = [
    '-y',
    '-i',
    `"${input}"`,
    filter ? '-vf' : null,
    filter ? `"${filter}"` : null,
    '-c:v',
    'libwebp',
    '-quality',
    String(preset.quality ?? 82),
    `"${output}"`,
  ].filter(Boolean);

  execSync(`ffmpeg ${args.join(' ')}`, { stdio: 'pipe' });

  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  return { fileName, outName, before, after };
}

const pngFiles = fs.readdirSync(assetsDir).filter((f) => f.toLowerCase().endsWith('.png'));
const results = [];

for (const file of pngFiles) {
  try {
    const result = convertFile(file);
    if (result) results.push(result);
  } catch (err) {
    console.error(`Failed: ${file}`, err.message);
    process.exitCode = 1;
  }
}

console.log('Converted PNG → WebP:\n');
for (const r of results) {
  const saved = ((1 - r.after / r.before) * 100).toFixed(1);
  console.log(
    `  ${r.fileName} → ${r.outName} (${Math.round(r.before / 1024)}KB → ${Math.round(r.after / 1024)}KB, -${saved}%)`
  );
}
