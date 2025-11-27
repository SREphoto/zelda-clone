const fs = require('fs');
const path = require('path');

const WORLD_COLS = 16;
const WORLD_ROWS = 8;
const TILE_SIZE = 16; // 16x16 tiles
const ROOM_WIDTH = 16; // 16 tiles wide
const ROOM_HEIGHT = 11; // 11 tiles high

const output = {
    width: WORLD_COLS * ROOM_WIDTH * 32, // Pixel width (32px scale)
    height: WORLD_ROWS * ROOM_HEIGHT * 32, // Pixel height
    rooms: {}
};

// Default Room (Empty with border)
const defaultLayout = [];
for (let y = 0; y < ROOM_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < ROOM_WIDTH; x++) {
        // Borders
        if (x === 0 || x === ROOM_WIDTH - 1 || y === 0 || y === ROOM_HEIGHT - 1) {
            row.push(1); // Wall/Tree
        } else {
            row.push(0); // Ground
        }
    }
    defaultLayout.push(row);
}

for (let y = 0; y < WORLD_ROWS; y++) {
    for (let x = 0; x < WORLD_COLS; x++) {
        const key = `${x},${y}`;

        // Basic Room Data
        const room = {
            tiles: JSON.parse(JSON.stringify(defaultLayout)), // Deep copy
            enemies: [],
            items: [],
            secrets: [],
            exits: []
        };

        // Customization for Start Room (7,7)
        if (x === 7 && y === 7) {
            // Clear center for player
            room.enemies = [];
            // Cave?
            room.tiles[0][7] = 0; // Opening top
            room.tiles[0][8] = 0;
        }

        // Customization for Room above Start (7,6)
        if (x === 7 && y === 6) {
            room.enemies = [
                { type: "octorok_red", x: 100, y: 100 },
                { type: "octorok_red", x: 300, y: 200 }
            ];
        }

        output.rooms[key] = room;
    }
}

const outputPath = path.join(__dirname, '../src/game/data/Overworld.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 4));
console.log(`Generated Overworld.json at ${outputPath}`);
