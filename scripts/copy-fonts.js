const fs = require('fs');
const path = require('path');

const fontDir = path.join(__dirname, '..', 'dist', 'assets', 'node_modules', '@expo', 'vector-icons', 'build', 'vendor', 'react-native-vector-icons', 'Fonts');
const targetDir = path.join(__dirname, '..', 'dist');

if (fs.existsSync(fontDir)) {
  const files = fs.readdirSync(fontDir);
  for (const file of files) {
    fs.copyFileSync(path.join(fontDir, file), path.join(targetDir, file));
    // Also copy plain name like Ionicons.ttf
    const baseName = file.split('.')[0] + '.ttf';
    fs.copyFileSync(path.join(fontDir, file), path.join(targetDir, baseName));
  }
  console.log('✓ Successfully copied icon fonts to dist root!');
}
