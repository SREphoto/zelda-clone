const fs = require('fs');
const path = require('path');

function getJPEGSize(filePath) {
    const buffer = fs.readFileSync(filePath);
    let i = 2;
    while (i < buffer.length) {
        if (buffer[i] === 0xFF) {
            const marker = buffer[i + 1];
            if (marker >= 0xC0 && marker <= 0xC3) {
                const height = buffer.readUInt16BE(i + 5);
                const width = buffer.readUInt16BE(i + 7);
                return { width, height };
            }
            i += 2 + buffer.readUInt16BE(i + 2);
        } else {
            i++;
        }
    }
    throw new Error('Not a valid JPEG or SOF marker not found');
}

const assets = [
    'public/assets/tiles.png',
    'public/assets/link.png',
    'public/assets/enemies.png',
    'public/assets/items.png'
];

assets.forEach(asset => {
    try {
        const size = getJPEGSize(path.join(process.cwd(), asset));
        console.log(`${asset}: ${size.width}x${size.height}`);
    } catch (e) {
        console.error(`${asset}: ${e.message}`);
    }
});
