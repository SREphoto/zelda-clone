const fs = require('fs');
const path = require('path');

const asset = 'public/assets/link.png';
const buffer = fs.readFileSync(path.join(process.cwd(), asset));
console.log(`First 8 bytes of ${asset}:`, buffer.slice(0, 8).toString('hex'));
