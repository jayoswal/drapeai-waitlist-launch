// Node.js script to generate assets/images/images.js with all image filenames
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'assets/images');
const outputFile = path.join(imagesDir, 'images.js');

const exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Error reading images directory:', err);
    process.exit(1);
  }
  const images = files.filter(f => exts.includes(path.extname(f).toLowerCase()));
  const jsContent = `window.DRAPE_IMAGES = ${JSON.stringify(images, null, 2)};\n`;
  fs.writeFileSync(outputFile, jsContent, 'utf8');
  console.log(`Generated ${outputFile} with ${images.length} images.`);
});
