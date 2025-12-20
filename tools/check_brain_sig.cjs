const fs = require('fs');
const asset = 'C:/Users/SREphoto/.gemini/antigravity/brain/f438df9d-c9ee-4207-ab09-3ba4d1dcd9e5/link_full_sheet_1766227271478.png';
const buffer = fs.readFileSync(asset);
console.log(`First 8 bytes of brain file:`, buffer.slice(0, 8).toString('hex'));
