const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'assets', 'images');
const outputDir = path.join(__dirname, 'assets', 'images', 'compressed');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all PNG files from input directory
const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.png'));

console.log(`Found ${files.length} PNG files to optimize...\n`);

// Process each image
files.forEach(async (file) => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);
  
  try {
    const info = await sharp(inputPath)
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const newSize = info.size;
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(`✓ ${file}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(0)} KB`);
    console.log(`  Optimized: ${(newSize / 1024).toFixed(0)} KB`);
    console.log(`  Reduction: ${reduction}%\n`);
  } catch (err) {
    console.error(`✗ Error processing ${file}:`, err.message);
  }
});

console.log('Optimization complete! Files saved in assets/images/compressed/');