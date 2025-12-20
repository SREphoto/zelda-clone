import { Camera } from './Camera';
import { OverworldData, TILE_FLOOR, TILE_WALL, TILE_WATER, TILE_BLOCK, TILE_TREE, TILE_SAND, TILE_GRAVE, TILE_STAIRS } from './data/OverworldData';
import { resources } from './ResourceManager';

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
        const tilesImg = resources.getImage('/assets/tiles.png');
        if (!tilesImg) return;

        const startCol = Math.floor(camera.x / this.tileSize);
        const endCol = startCol + (camera.width / this.tileSize) + 1;
        const startRow = Math.floor(camera.y / this.tileSize);
        const endRow = startRow + (camera.height / this.tileSize) + 1;

        const srcTileSize = 256;

        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                if (y >= 0 && y < this.tiles.length && x >= 0 && x < this.tiles[0].length) {
                    const tile = this.tiles[y][x];
                    const tileX = Math.floor((x * this.tileSize) - camera.x);
                    const tileY = Math.floor((y * this.tileSize) - camera.y);

                    // Source coordinates (sx, sy) on the spritesheet (1024x1024)
                    let sx = 0;
                    let sy = 0;

                    switch (tile) {
                        case TILE_FLOOR: sx = 0; sy = 0; break;
                        case TILE_SAND: sx = 256; sy = 0; break;
                        case TILE_WALL: sx = 512; sy = 0; break;
                        case TILE_WATER: sx = 0; sy = 256; break;
                        case TILE_BLOCK: sx = 0; sy = 768; break;
                        case TILE_TREE: sx = 0; sy = 512; break;
                        case TILE_GRAVE: sx = 512; sy = 512; break; // Approximating grave position
                        case TILE_STAIRS: sx = 768; sy = 768; break; // Hole/Stairs
                        default: sx = 0; sy = 0; break;
                    }

                    // Animate Water (Simple toggle between adjacent tiles if they exist)
                    if (tile === TILE_WATER) {
                        const frame = Math.floor(Date.now() / 500) % 4;
                        sx = frame * 256;
                    }

                    ctx.drawImage(tilesImg, sx, sy, srcTileSize, srcTileSize, tileX, tileY, this.tileSize, this.tileSize);
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
