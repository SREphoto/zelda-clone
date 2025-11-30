import { EnemyType } from '../Enemy';
import { ItemType } from '../Item';

export interface ScreenData {
    tiles: number[][];
    enemies?: Array<{ type: number; x: number; y: number }>;
    items?: Array<{ type: ItemType; x: number; y: number; price?: number }>;
    secretWalls?: Array<{ x: number; y: number; requiresCandle: boolean }>;
    doors?: Array<{ x: number; y: number; direction: 'up' | 'down' | 'left' | 'right'; isLocked: boolean }>;
    caveEntrance?: { x: number; y: number; text?: string };
}

// Tile constants
export const TILE_FLOOR = 0;
export const TILE_WALL = 1;
export const TILE_WATER = 2;
export const TILE_BLOCK = 3;
export const TILE_TREE = 4;
export const TILE_SAND = 5;
export const TILE_GRAVE = 6;
export const TILE_STAIRS = 7;

// Helper to create default room with borders
function createRoom(fillTile: number = TILE_FLOOR): number[][] {
    const room: number[][] = [];
    for (let y = 0; y < 11; y++) {
        const row: number[] = [];
        for (let x = 0; x < 16; x++) {
            // Edges are walls
            if (x === 0 || x === 15 || y === 0 || y === 10) {
                row.push(TILE_WALL);
            } else {
                row.push(fillTile);
            }
        }
        room.push(row);
    }

    // Add doors (gaps in walls)
    const midX = 7;
    const midY = 5;

    // Top/Bottom doors
    room[0][midX] = fillTile;
    room[0][midX + 1] = fillTile;
    room[10][midX] = fillTile;
    room[10][midX + 1] = fillTile;

    // Left/Right doors
    room[midY][0] = fillTile;
    room[midY][15] = fillTile;

    return room;
}

function addRandomObstacles(room: number[][], tileType: number, count: number) {
    for (let i = 0; i < count; i++) {
        const x = 2 + Math.floor(Math.random() * 12);
        const y = 2 + Math.floor(Math.random() * 7);
        room[y][x] = tileType;
    }
}

function generateEnemies(biome: string): Array<{ type: number; x: number; y: number }> {
    const enemies: Array<{ type: number; x: number; y: number }> = [];
    const count = 2 + Math.floor(Math.random() * 4); // 2-5 enemies

    for (let i = 0; i < count; i++) {
        const x = 64 + Math.floor(Math.random() * 384);
        const y = 64 + Math.floor(Math.random() * 224);

        let type: number = EnemyType.OctorokRed;

        switch (biome) {
            case 'forest':
                type = Math.random() < 0.7 ? EnemyType.OctorokRed : EnemyType.MoblinRed;
                if (Math.random() < 0.1) type = EnemyType.OctorokBlue;
                break;
            case 'desert':
                type = Math.random() < 0.6 ? EnemyType.LeeverRed : EnemyType.LeeverBlue;
                if (Math.random() < 0.3) type = EnemyType.Peahat;
                break;
            case 'mountain':
                type = Math.random() < 0.6 ? EnemyType.TektiteRed : EnemyType.TektiteBlue;
                if (Math.random() < 0.2) type = EnemyType.LynelRed;
                break;
            case 'graveyard':
                type = EnemyType.Ghini;
                break;
            case 'water':
                type = EnemyType.Zola;
                break;
            case 'dungeon':
                const dungeonTypes = [EnemyType.Stalfos, EnemyType.Keese, EnemyType.Zol, EnemyType.Rope, EnemyType.GoriyaRed];
                type = dungeonTypes[Math.floor(Math.random() * dungeonTypes.length)];
                break;
        }

        enemies.push({ type, x, y });
    }
    return enemies;
}

// Overworld data: 16 columns x 8 rows = 128 screens
export const OverworldData: Record<string, ScreenData> = {};

// Generate Map
for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 16; x++) {
        const key = `${x},${y}`;
        let biome = 'forest';
        let baseTile = TILE_FLOOR;
        let obstacleTile = TILE_TREE;

        // Determine Biome based on region
        if (y < 2) {
            biome = 'mountain';
            baseTile = TILE_FLOOR; // Brown color in palette usually
            obstacleTile = TILE_BLOCK; // Rocks
        } else if (x < 4 && y > 4) {
            biome = 'desert';
            baseTile = TILE_SAND;
            obstacleTile = TILE_BLOCK; // Cactus/Rock
        } else if (x > 12 && y > 4) {
            biome = 'water';
            baseTile = TILE_FLOOR; // Coast
            obstacleTile = TILE_WATER;
        } else if (x > 4 && x < 8 && y === 2) {
            biome = 'graveyard';
            baseTile = TILE_FLOOR;
            obstacleTile = TILE_GRAVE;
        }

        const room = createRoom(baseTile);

        // Add obstacles
        if (biome === 'forest') addRandomObstacles(room, obstacleTile, 8);
        if (biome === 'mountain') addRandomObstacles(room, obstacleTile, 12);
        if (biome === 'desert') addRandomObstacles(room, obstacleTile, 4);
        if (biome === 'graveyard') addRandomObstacles(room, obstacleTile, 10);
        if (biome === 'water') addRandomObstacles(room, obstacleTile, 20);

        // Generate Enemies
        const enemies = generateEnemies(biome);

        OverworldData[key] = {
            tiles: room,
            enemies: enemies
        };
    }
}

// --- SPECIAL SCREENS OVERRIDES ---

// Start Screen (7,7)
OverworldData["7,7"] = {
    tiles: createRoom(TILE_FLOOR),
    enemies: [], // Safe zone
    caveEntrance: { x: 256, y: 100, text: "IT'S DANGEROUS TO GO ALONE! TAKE THIS." },
    items: [{ type: ItemType.Heart, x: 256, y: 200 }] // Free heart (should be Sword, but using Heart for now as Sword is default weapon)
};

// Boss Arenas (Scattered for testing/challenge)

// Aquamentus (Mountain Top Left)
OverworldData["1,1"] = {
    tiles: createRoom(TILE_FLOOR),
    enemies: [{ type: EnemyType.Aquamentus, x: 350, y: 176 }],
    items: [{ type: ItemType.HeartContainer, x: 256, y: 100 }]
};

// Dodongo (Desert Cave)
OverworldData["2,6"] = {
    tiles: createRoom(TILE_SAND),
    enemies: [{ type: EnemyType.Dodongo, x: 256, y: 176 }],
    items: [{ type: ItemType.Bomb, x: 150, y: 250 }]
};

// Manhandla (Forest Clearing)
OverworldData["10,5"] = {
    tiles: createRoom(TILE_FLOOR),
    enemies: [{ type: EnemyType.Manhandla, x: 256, y: 176 }],
    items: [{ type: ItemType.RupeeGreen, x: 256, y: 100 }]
};

// Gleeok (Mountain Peak)
OverworldData["8,0"] = {
    tiles: createRoom(TILE_FLOOR),
    enemies: [{ type: EnemyType.Gleeok, x: 256, y: 176 }],
    items: [{ type: ItemType.Triforce, x: 256, y: 80 }] // Win condition
};

// Digdogger (Lake Island)
OverworldData["14,6"] = {
    tiles: createRoom(TILE_FLOOR),
    enemies: [{ type: EnemyType.Digdogger, x: 256, y: 176 }],
    items: [{ type: ItemType.MagicRod, x: 256, y: 100 }]
};

// Gohma (Deep Dungeon - simulated)
OverworldData["4,2"] = {
    tiles: createRoom(TILE_BLOCK),
    enemies: [{ type: EnemyType.Gohma, x: 256, y: 176 }],
    items: [{ type: ItemType.SilverArrow, x: 256, y: 250 }]
};

// Ganon (Final Boss)
OverworldData["8,1"] = {
    tiles: createRoom(TILE_FLOOR),
    enemies: [{ type: EnemyType.Ganon, x: 256, y: 176 }],
    items: [{ type: ItemType.Triforce, x: 256, y: 80 }],
    doors: [{ x: 256, y: 32, direction: 'up', isLocked: true }]
};

// Item Shops / Secret Rooms
OverworldData["6,7"] = {
    tiles: createRoom(TILE_FLOOR),
    enemies: [],
    caveEntrance: { x: 256, y: 100, text: "BUY SOMETHIN' WILL YA!" },
    items: [
        { type: ItemType.MagicalShield, x: 0, y: 0, price: 90 },
        { type: ItemType.Bomb, x: 0, y: 0, price: 20 },
        { type: ItemType.Heart, x: 0, y: 0, price: 10 }
    ]
};

OverworldData["8,7"] = {
    tiles: createRoom(TILE_FLOOR),
    enemies: [{ type: EnemyType.OctorokBlue, x: 300, y: 200 }],
    items: [{ type: ItemType.Boomerang, x: 256, y: 176 }]
};

OverworldData["5,5"] = { // Graveyard Secret
    tiles: createRoom(TILE_FLOOR),
    enemies: [{ type: EnemyType.Ghini, x: 100, y: 100 }, { type: EnemyType.Ghini, x: 400, y: 100 }],
    items: [{ type: ItemType.BlueRing, x: 256, y: 176, price: 250 }],
    caveEntrance: { x: 256, y: 176, text: "IT'S A SECRET TO EVERYBODY." }
};
