import { Camera } from './Camera';

export class WorldMap {
    private visitedRooms: Set<string> = new Set();
    private currentRoom: { x: number, y: number } = { x: 0, y: 0 };
    private worldSize: { width: number, height: number } = { width: 4, height: 4 };

    public markRoomVisited(roomX: number, roomY: number) {
        this.visitedRooms.add(`${roomX},${roomY}`);
    }

    public isRoomVisited(roomX: number, roomY: number): boolean {
        return this.visitedRooms.has(`${roomX},${roomY}`);
    }

    public updateCurrentRoom(camera: Camera, roomWidth: number, roomHeight: number) {
        this.currentRoom.x = Math.floor(camera.x / roomWidth);
        this.currentRoom.y = Math.floor(camera.y / roomHeight);
        this.markRoomVisited(this.currentRoom.x, this.currentRoom.y);
    }

    public render(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        // Semi-transparent black background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Map title
        ctx.fillStyle = '#FFD700'; // Gold
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('WORLD MAP', canvasWidth / 2, 60);

        // Calculate map grid position (centered)
        const roomSize = 48; // Size of each room square on the map
        const gridWidth = this.worldSize.width * roomSize;
        const gridHeight = this.worldSize.height * roomSize;
        const startX = (canvasWidth - gridWidth) / 2;
        const startY = (canvasHeight - gridHeight) / 2 + 20;

        // Boss rooms (hardcoded)
        const bossRooms = ['1,1', '2,1', '3,1', '3,3'];

        // Draw grid
        for (let ry = 0; ry < this.worldSize.height; ry++) {
            for (let rx = 0; rx < this.worldSize.width; rx++) {
                const x = startX + rx * roomSize;
                const y = startY + ry * roomSize;
                const roomKey = `${rx},${ry}`;
                const isVisited = this.isRoomVisited(rx, ry);
                const isCurrent = rx === this.currentRoom.x && ry === this.currentRoom.y;
                const isBoss = bossRooms.includes(roomKey);

                // Room background
                if (isBoss && isVisited) {
                    ctx.fillStyle = '#660000'; // Dark red for boss rooms
                } else if (isVisited) {
                    ctx.fillStyle = '#444444';
                } else {
                    ctx.fillStyle = '#111111';
                }
                ctx.fillRect(x + 2, y + 2, roomSize - 4, roomSize - 4);

                // Room border
                if (isBoss) {
                    ctx.strokeStyle = isVisited ? '#FF0000' : '#660000'; // Red for boss
                    ctx.lineWidth = isVisited ? 3 : 2;
                } else {
                    ctx.strokeStyle = isVisited ? '#888888' : '#333333';
                    ctx.lineWidth = 2;
                }
                ctx.strokeRect(x + 2, y + 2, roomSize - 4, roomSize - 4);

                // Boss marker (skull)
                if (isBoss && isVisited) {
                    ctx.fillStyle = '#FF0000';
                    ctx.font = 'bold 20px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText('☠', x + roomSize / 2, y + roomSize / 2 + 7);
                }

                // Current room indicator
                if (isCurrent) {
                    ctx.fillStyle = '#00FF00';
                    ctx.strokeStyle = '#00FF00';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(x + 4, y + 4, roomSize - 8, roomSize - 8);

                    // Pulsing green dot
                    ctx.beginPath();
                    ctx.arc(x + roomSize / 2, y + roomSize / 2, 6, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Room coordinates (if visited and not current)
                if (isVisited && !isCurrent && !isBoss) {
                    ctx.fillStyle = '#AAAAAA';
                    ctx.font = '10px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${rx},${ry}`, x + roomSize / 2, y + roomSize - 6);
                }
            }
        }

        // Instructions and legend
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Press M to close', canvasWidth / 2, canvasHeight - 60);

        // Legend
        ctx.textAlign = 'left';
        const legendX = startX;
        const legendY = startY + gridHeight + 20;

        ctx.fillStyle = '#00FF00';
        ctx.fillRect(legendX, legendY, 12, 12);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Current Room', legendX + 18, legendY + 10);

        ctx.fillStyle = '#FF0000';
        ctx.fillRect(legendX + 150, legendY, 12, 12);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Boss Room', legendX + 168, legendY + 10);
    }
}
