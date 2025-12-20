const fs = require('fs');
const path = require('path');

function getPNGSize(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer.toString('ascii', 1, 4) !== 'PNG') {
        throw new Error('Not a PNG file');
    }
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
}

const assets = [
    'public/assets/tiles.png',
    'public/assets/link.png',
    'public/assets/enemies.png',
    'public/assets/items.png'
];

assets.forEach(asset => {
    try {
        const size = getPNGSize(path.join(process.cwd(), asset));
        console.log(`${asset}: ${size.width}x${size.height}`);
    } catch (e) {
        console.error(`${asset}: ${e.message}`);
    }
});
