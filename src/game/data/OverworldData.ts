import { EnemyType } from '../Enemy';
import { ItemType } from '../Item';

export interface ScreenData {
    tiles: number[][];
    enemies?: Array<{ type: EnemyType; x: number; y: number }>;
    items?: Array<{ type: ItemType; x: number; y: number }>;
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
function createDefaultRoom(): number[][] {
    const room: number[][] = [];
    for (let y = 0; y < 11; y++) {
        const row: number[] = [];
        for (let x = 0; x < 16; x++) {
            // Edges are walls
            if (x === 0 || x === 15 || y === 0 || y === 10) {
                row.push(TILE_WALL);
            } else {
                row.push(TILE_FLOOR);
            }
        }
        room.push(row);
    }

    // Add doors (gaps in walls)
    const midX = 7;
    const midY = 5;

    // Top/Bottom doors
    room[0][midX] = TILE_FLOOR;
    room[0][midX + 1] = TILE_FLOOR;
    room[10][midX] = TILE_FLOOR;
    room[10][midX + 1] = TILE_FLOOR;

    // Left/Right doors
    room[midY][0] = TILE_FLOOR;
    room[midY][15] = TILE_FLOOR;

    return room;
}

// Overworld data: 16 columns x 8 rows = 128 screens
export const OverworldData: Record<string, ScreenData> = {
    // Starting area (0,0)
    "0,0": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.OctorokRed, x: 100, y: 100 },
            { type: EnemyType.OctorokRed, x: 300, y: 250 },
            { type: EnemyType.OctorokBlue, x: 200, y: 200 }
        ]
    },

    // Screen (1,0) - Boomerang room
    "1,0": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.TektiteRed, x: 150, y: 150 },
            { type: EnemyType.TektiteRed, x: 350, y: 150 },
            { type: EnemyType.TektiteBlue, x: 250, y: 250 }
        ],
        items: [
            { type: ItemType.Boomerang, x: 256, y: 176 }
        ]
    },

    // Screen (2,0) - Stalfos room with obstacles
    "2,0": {
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 1],
            [1, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 1],
            [1, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1]
        ],
        enemies: [
            { type: EnemyType.Stalfos, x: 100, y: 100 },
            { type: EnemyType.Stalfos, x: 300, y: 200 },
            { type: EnemyType.Keese, x: 200, y: 150 },
            { type: EnemyType.Keese, x: 400, y: 100 },
            { type: EnemyType.Zol, x: 250, y: 250 }
        ],
        items: [
            { type: ItemType.MagicalShield, x: 256, y: 176 }
        ]
    },

    // Screen (3,0) - Wizzrobe room
    "3,0": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.WizzrobeRed, x: 100, y: 100 },
            { type: EnemyType.WizzrobeBlue, x: 300, y: 200 },
            { type: EnemyType.WizzrobeRed, x: 200, y: 300 }
        ],
        items: [
            { type: ItemType.Map, x: 300, y: 100 },
            { type: ItemType.FiveRupee, x: 200, y: 250 }
        ]
    },

    // Screen (0,1) - Moblin room
    "0,1": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.MoblinRed, x: 100, y: 100 },
            { type: EnemyType.MoblinRed, x: 400, y: 100 },
            { type: EnemyType.MoblinBlue, x: 250, y: 250 }
        ],
        items: [
            { type: ItemType.Compass, x: 150, y: 150 }
        ]
    },

    // Screen (1,1) - Gohma Boss Room
    "1,1": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.Gohma, x: 256, y: 176 }
        ],
        items: [
            { type: ItemType.Heart, x: 100, y: 100 },
            { type: ItemType.Heart, x: 400, y: 100 }
        ]
    },

    // Screen (2,1) - Aquamentus Boss Room
    "2,1": {
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 1],
            [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 1],
            [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        enemies: [
            { type: EnemyType.Aquamentus, x: 350, y: 176 }
        ],
        items: [
            { type: ItemType.SilverArrow, x: 100, y: 100 }
        ]
    },

    // Screen (3,1) - Ganon Boss Room with Triforce
    "3,1": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.Ganon, x: 256, y: 176 }
        ],
        items: [
            { type: ItemType.Fairy, x: 100, y: 250 },
            { type: ItemType.Triforce, x: 256, y: 80 }  // Victory item!
        ],
        doors: [
            { x: 256, y: 32, direction: 'up', isLocked: true }  // Locked door protecting Triforce
        ]
    },

    // Screen (0,2) - Darknut room with locked door
    "0,2": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.DarknutRed, x: 150, y: 150 },
            { type: EnemyType.DarknutRed, x: 350, y: 150 }
        ],
        items: [
            { type: ItemType.Key, x: 200, y: 200 },
            { type: ItemType.RupeeGreen, x: 300, y: 150 }
        ],
        doors: [
            { x: 224, y: 32, direction: 'up', isLocked: true }  // Locked door at top
        ],
        secretWalls: [
            { x: 480, y: 160, requiresCandle: false }  // Secret wall on right side
        ]
    },

    // Screen (1,2) - Gel/Zol room with secret
    "1,2": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.Gel, x: 100, y: 100 },
            { type: EnemyType.Gel, x: 200, y: 100 },
            { type: EnemyType.Gel, x: 300, y: 100 },
            { type: EnemyType.Zol, x: 250, y: 250 }
        ],
        items: [
            { type: ItemType.Candle, x: 250, y: 150 }
        ],
        secretWalls: [
            { x: 32, y: 160, requiresCandle: true }  // Secret requires candle to reveal
        ]
    },

    // Screen (2,2) - Blue Darknut room
    "2,2": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.DarknutBlue, x: 200, y: 150 },
            { type: EnemyType.DarknutBlue, x: 300, y: 200 }
        ],
        items: [
            { type: ItemType.BlueRing, x: 256, y: 176 }
        ]
    },

    // Screen (3,2) - Blue Octorok room
    "3,2": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.OctorokBlue, x: 100, y: 100 },
            { type: EnemyType.OctorokBlue, x: 400, y: 100 },
            { type: EnemyType.OctorokBlue, x: 250, y: 250 }
        ],
        items: [
            { type: ItemType.FiveRupee, x: 200, y: 150 },
            { type: ItemType.RupeeGreen, x: 300, y: 200 }
        ]
    },

    // Screen (0,3) - Blue Tektite room
    "0,3": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.TektiteBlue, x: 150, y: 150 },
            { type: EnemyType.TektiteBlue, x: 350, y: 200 },
            { type: EnemyType.Keese, x: 250, y: 100 }
        ],
        items: [
            { type: ItemType.Ladder, x: 250, y: 150 }
        ]
    },

    // Screen (1,3) - Blue Moblin room
    "1,3": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.MoblinBlue, x: 100, y: 100 },
            { type: EnemyType.MoblinBlue, x: 400, y: 200 },
            { type: EnemyType.MoblinRed, x: 250, y: 150 }
        ],
        items: [
            { type: ItemType.MagicRod, x: 256, y: 176 }
        ]
    },

    // Screen (2,3) - Stalfos room
    "2,3": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.Stalfos, x: 150, y: 100 },
            { type: EnemyType.Stalfos, x: 350, y: 100 },
            { type: EnemyType.Stalfos, x: 250, y: 250 }
        ],
        items: [
            { type: ItemType.RedRing, x: 256, y: 176 }
        ]
    },

    // Screen (3,3) - Dodongo Boss Room
    "3,3": {
        tiles: createDefaultRoom(),
        enemies: [
            { type: EnemyType.Dodongo, x: 256, y: 176 }
        ],
        items: [
            { type: ItemType.Bomb, x: 150, y: 250 },
            { type: ItemType.Bomb, x: 350, y: 250 }
        ]
    }
};

// For all other screens (4-127), use default empty rooms
for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 16; x++) {
        const key = `${x},${y}`;
        if (!OverworldData[key]) {
            OverworldData[key] = {
                tiles: createDefaultRoom(),
                enemies: []
            };
        }
    }
}
