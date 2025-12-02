import { Camera } from './Camera';
import { OverworldData, TILE_FLOOR, TILE_WALL, TILE_WATER, TILE_BLOCK, TILE_TREE, TILE_SAND, TILE_GRAVE, TILE_STAIRS } from './data/OverworldData';

export class Tilemap {
    public tiles: number[][];
    public tileSize: number = 32;

    // Room dimensions in tiles
    public static readonly ROOM_WIDTH = 16;
    public static readonly ROOM_HEIGHT = 11;

    // World dimensions in rooms
    public static readonly WORLD_COLS = 16;
    public static readonly WORLD_ROWS = 8;

    // Tile Types (re-export for backwards compatibility)
    public static readonly TILE_FLOOR = TILE_FLOOR;
    public static readonly TILE_WALL = TILE_WALL;
    public static readonly TILE_WATER = TILE_WATER;
    public static readonly TILE_BLOCK = TILE_BLOCK;

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

        // Load each screen from OverworldData
        for (let ry = 0; ry < Tilemap.WORLD_ROWS; ry++) {
            for (let rx = 0; rx < Tilemap.WORLD_COLS; rx++) {
                this.loadScreen(rx, ry);
            }
        }
    }

    private loadScreen(roomX: number, roomY: number) {
        const startX = roomX * Tilemap.ROOM_WIDTH;
        const startY = roomY * Tilemap.ROOM_HEIGHT;
        const key = `${roomX},${roomY}`;

        // Get screen data
        const screenData = OverworldData[key];
        if (!screenData) {
            console.warn(`No data for screen ${key}`);
            return;
        }

        // Copy tile data
        for (let y = 0; y < Tilemap.ROOM_HEIGHT; y++) {
            for (let x = 0; x < Tilemap.ROOM_WIDTH; x++) {
                this.tiles[startY + y][startX + x] = screenData.tiles[y][x];
            }
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
                    const tileX = Math.floor((x * this.tileSize) - camera.x);
                    const tileY = Math.floor((y * this.tileSize) - camera.y);

                    // Draw Floor Background first
                    if (tile === TILE_SAND) {
                        ctx.fillStyle = '#EEDDAA'; // Sand
                        ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);
                        // Sand texture
                        ctx.fillStyle = '#DDBB88';
                        if ((x + y) % 2 === 0) ctx.fillRect(tileX + 8, tileY + 8, 2, 2);
                        if ((x * y) % 3 === 0) ctx.fillRect(tileX + 20, tileY + 20, 2, 2);
                    } else {
                        ctx.fillStyle = '#eebb88'; // Standard Floor
                        ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);
                        // Dirt texture
                        ctx.fillStyle = '#cc9966';
                        if ((x + y) % 3 === 0) ctx.fillRect(tileX + 10, tileY + 10, 4, 4);
                        if ((x * y) % 5 === 0) ctx.fillRect(tileX + 22, tileY + 5, 2, 2);
                    }

                    if (tile === TILE_WALL) {
                        ctx.fillStyle = '#555'; // Wall
                        ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);

                        // Brick pattern
                        ctx.fillStyle = '#444';
                        ctx.fillRect(tileX + 2, tileY + 2, 12, 12);
                        ctx.fillRect(tileX + 18, tileY + 2, 12, 12);
                        ctx.fillRect(tileX + 2, tileY + 18, 12, 12);
                        ctx.fillRect(tileX + 18, tileY + 18, 12, 12);

                        // Bevel effect
                        ctx.fillStyle = 'rgba(255,255,255,0.1)';
                        ctx.fillRect(tileX, tileY, this.tileSize, 2);
                        ctx.fillRect(tileX, tileY, 2, this.tileSize);

                    } else if (tile === TILE_WATER) {
                        ctx.fillStyle = '#0000AA'; // Water
                        ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);
                        // Wave pattern (animated)
                        ctx.fillStyle = '#4444FF';
                        const offset = Math.floor(Date.now() / 200) % 8;
                        if ((x + y) % 2 === 0) {
                            ctx.fillRect(tileX + 4 + offset, tileY + 8, 8, 2);
                            ctx.fillRect(tileX + 16 - offset, tileY + 20, 8, 2);
                        } else {
                            ctx.fillRect(tileX + 8, tileY + 4 + offset, 8, 2);
                        }

                    } else if (tile === TILE_BLOCK) {
                        ctx.fillStyle = '#008800'; // Block (Green)
                        ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);
                        // Detail
                        ctx.strokeStyle = '#004400';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(tileX + 4, tileY + 4, 24, 24);
                        ctx.beginPath();
                        ctx.moveTo(tileX + 4, tileY + 4); ctx.lineTo(tileX + 28, tileY + 28);
                        ctx.moveTo(tileX + 28, tileY + 4); ctx.lineTo(tileX + 4, tileY + 28);
                        ctx.stroke();

                    } else if (tile === TILE_TREE) {
                        // Tree (Green Circle)
                        ctx.fillStyle = '#006600';
                        ctx.beginPath();
                        ctx.arc(tileX + 16, tileY + 16, 14, 0, Math.PI * 2);
                        ctx.fill();

                        // Leaf texture
                        ctx.fillStyle = '#008800';
                        ctx.beginPath();
                        ctx.arc(tileX + 12, tileY + 12, 6, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(tileX + 20, tileY + 14, 5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(tileX + 14, tileY + 20, 5, 0, Math.PI * 2);
                        ctx.fill();

                    } else if (tile === TILE_GRAVE) {
                        // Grave (Grey Stone)
                        ctx.fillStyle = '#777';
                        ctx.fillRect(tileX + 8, tileY + 4, 16, 24);
                        // Cross
                        ctx.fillStyle = '#333';
                        ctx.fillRect(tileX + 14, tileY + 8, 4, 12);
                        ctx.fillRect(tileX + 10, tileY + 12, 12, 4);
                        // Shadow
                        ctx.fillStyle = 'rgba(0,0,0,0.3)';
                        ctx.fillRect(tileX + 24, tileY + 4, 2, 24);

                    } else if (tile === TILE_STAIRS) {
                        // Stairs (Black Square)
                        ctx.fillStyle = '#000';
                        ctx.fillRect(tileX + 8, tileY + 8, 16, 16);
                        // Steps
                        ctx.fillStyle = '#333';
                        ctx.fillRect(tileX + 8, tileY + 12, 16, 2);
                        ctx.fillRect(tileX + 8, tileY + 18, 16, 2);
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
        return tile === TILE_WALL || tile === TILE_WATER || tile === TILE_BLOCK || tile === TILE_TREE || tile === TILE_GRAVE;
    }
}
