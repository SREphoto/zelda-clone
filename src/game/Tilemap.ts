import { Camera } from './Camera';

export class Tilemap {
    public tiles: number[][];
    public tileSize: number = 32;

    // Room dimensions in tiles
    public static readonly ROOM_WIDTH = 16;
    public static readonly ROOM_HEIGHT = 11;

    // World dimensions in rooms
    public static readonly WORLD_COLS = 4;
    public static readonly WORLD_ROWS = 4;

    // Tile Types
    public static readonly TILE_FLOOR = 0;
    public static readonly TILE_WALL = 1;
    public static readonly TILE_WATER = 2;
    public static readonly TILE_BLOCK = 3;

    // Custom Room Layouts (x,y string key)
    // 16x11 Grid
    private static readonly CustomLayouts: Record<string, number[][]> = {
        "2,0": [ // Stalfos / Item Room
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 1],
            [1, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Door Right
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 1],
            [1, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1]
        ],
        "2,1": [ // Aquamentus Room
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 1], // Water
            [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Door Right
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 1],
            [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    };

    public get width() { return this.tiles[0].length * this.tileSize; }
    public get height() { return this.tiles.length * this.tileSize; }

    constructor() {
        this.tiles = [];
        this.generateWorld();
    }

    private generateWorld() {
        const totalCols = Tilemap.WORLD_COLS * Tilemap.ROOM_WIDTH;
        const totalRows = Tilemap.WORLD_ROWS * Tilemap.ROOM_HEIGHT;

        // Initialize empty grid
        for (let y = 0; y < totalRows; y++) {
            const row = new Array(totalCols).fill(0);
            this.tiles.push(row);
        }

        // Generate each room
        for (let ry = 0; ry < Tilemap.WORLD_ROWS; ry++) {
            for (let rx = 0; rx < Tilemap.WORLD_COLS; rx++) {
                this.generateRoom(rx, ry);
            }
        }
    }

    private generateRoom(roomX: number, roomY: number) {
        const startX = roomX * Tilemap.ROOM_WIDTH;
        const startY = roomY * Tilemap.ROOM_HEIGHT;
        const key = `${roomX},${roomY}`;

        // Check for Custom Layout
        if (Tilemap.CustomLayouts[key]) {
            const layout = Tilemap.CustomLayouts[key];
            for (let y = 0; y < Tilemap.ROOM_HEIGHT; y++) {
                for (let x = 0; x < Tilemap.ROOM_WIDTH; x++) {
                    this.tiles[startY + y][startX + x] = layout[y][x];
                }
            }
            return;
        }

        // Basic Room Template (Walls on edges)
        for (let y = 0; y < Tilemap.ROOM_HEIGHT; y++) {
            for (let x = 0; x < Tilemap.ROOM_WIDTH; x++) {
                const globalX = startX + x;
                const globalY = startY + y;

                // Edges
                if (x === 0 || x === Tilemap.ROOM_WIDTH - 1 || y === 0 || y === Tilemap.ROOM_HEIGHT - 1) {
                    this.tiles[globalY][globalX] = Tilemap.TILE_WALL;
                } else {
                    this.tiles[globalY][globalX] = Tilemap.TILE_FLOOR;
                }

                // Add "Doors" (gaps in middle of walls)
                const midX = Math.floor(Tilemap.ROOM_WIDTH / 2);
                const midY = Math.floor(Tilemap.ROOM_HEIGHT / 2);

                if (x >= midX - 1 && x <= midX && (y === 0 || y === Tilemap.ROOM_HEIGHT - 1)) {
                    this.tiles[globalY][globalX] = Tilemap.TILE_FLOOR; // Vertical Doors (2 wide)
                }
                if (y >= midY - 1 && y <= midY && (x === 0 || x === Tilemap.ROOM_WIDTH - 1)) {
                    this.tiles[globalY][globalX] = Tilemap.TILE_FLOOR; // Horizontal Doors (2 high)
                }
            }
        }

        // Add random obstacles inside (avoiding center and doors)
        const seed = roomX * 10 + roomY; // Simple pseudo-random
        if (seed % 3 === 0) {
            // Pattern: Center Block
            this.tiles[startY + 5][startX + 7] = Tilemap.TILE_BLOCK;
            this.tiles[startY + 5][startX + 8] = Tilemap.TILE_BLOCK;
        } else if (seed % 3 === 1) {
            // Pattern: Four Corners
            this.tiles[startY + 2][startX + 2] = Tilemap.TILE_BLOCK;
            this.tiles[startY + 2][startX + 13] = Tilemap.TILE_BLOCK;
            this.tiles[startY + 8][startX + 2] = Tilemap.TILE_BLOCK;
            this.tiles[startY + 8][startX + 13] = Tilemap.TILE_BLOCK;
        }
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera) {
        const startCol = Math.floor(camera.x / this.tileSize);
        const endCol = startCol + (camera.width / this.tileSize) + 1;
        const startRow = Math.floor(camera.y / this.tileSize);
        const endRow = startRow + (camera.height / this.tileSize) + 1;

        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                if (y >= 0 && y < this.tiles.length && x >= 0 && x < this.tiles[0].length) {
                    const tile = this.tiles[y][x];
                    const tileX = (x * this.tileSize) - camera.x;
                    const tileY = (y * this.tileSize) - camera.y;

                    if (tile === Tilemap.TILE_WALL) {
                        ctx.fillStyle = '#555'; // Wall
                        ctx.fillRect(Math.floor(tileX), Math.floor(tileY), this.tileSize, this.tileSize);

                        // Bevel effect
                        ctx.fillStyle = 'rgba(255,255,255,0.2)';
                        ctx.fillRect(Math.floor(tileX), Math.floor(tileY), this.tileSize, 4);
                        ctx.fillRect(Math.floor(tileX), Math.floor(tileY), 4, this.tileSize);
                        ctx.fillStyle = 'rgba(0,0,0,0.4)';
                        ctx.fillRect(Math.floor(tileX + this.tileSize - 4), Math.floor(tileY), 4, this.tileSize);
                        ctx.fillRect(Math.floor(tileX), Math.floor(tileY + this.tileSize - 4), this.tileSize, 4);

                    } else if (tile === Tilemap.TILE_WATER) {
                        ctx.fillStyle = '#0000AA'; // Water
                        ctx.fillRect(Math.floor(tileX), Math.floor(tileY), this.tileSize, this.tileSize);
                        // Ripple
                        ctx.fillStyle = '#4444FF';
                        ctx.fillRect(Math.floor(tileX + 8), Math.floor(tileY + 8), 16, 4);

                    } else if (tile === Tilemap.TILE_BLOCK) {
                        ctx.fillStyle = '#008800'; // Block (Green)
                        ctx.fillRect(Math.floor(tileX), Math.floor(tileY), this.tileSize, this.tileSize);
                        // Detail
                        ctx.strokeStyle = '#004400';
                        ctx.strokeRect(Math.floor(tileX + 4), Math.floor(tileY + 4), 24, 24);

                    } else {
                        ctx.fillStyle = '#eebb88'; // Sand/Dungeon Floor color
                        ctx.fillRect(Math.floor(tileX), Math.floor(tileY), this.tileSize, this.tileSize);

                        // Floor detail
                        if ((x + y) % 2 === 0) {
                            ctx.fillStyle = 'rgba(0,0,0,0.03)';
                            ctx.fillRect(Math.floor(tileX + 8), Math.floor(tileY + 8), 16, 16);
                        }
                    }
                }
            }
        }
    }

    public isSolid(x: number, y: number): boolean {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);

        if (col < 0 || col >= this.tiles[0].length || row < 0 || row >= this.tiles.length) {
            return true;
        }

        const tile = this.tiles[row][col];
        return tile === Tilemap.TILE_WALL || tile === Tilemap.TILE_WATER || tile === Tilemap.TILE_BLOCK;
    }
}
