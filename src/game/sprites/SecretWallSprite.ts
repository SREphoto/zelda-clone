import { SecretWall } from '../Door';

export class SecretWallSprite {
    constructor() {
    }

    public draw(
        ctx: CanvasRenderingContext2D,
        _frameX: number,
        _frameY: number,
        _frameWidth: number,
        _frameHeight: number,
        width: number,
        height: number,
        wall: SecretWall,
        camera: { x: number, y: number }
    ) {
        const screenX = wall.x - camera.x;
        const screenY = wall.y - camera.y;

        if (!wall.isRevealed) {
            // Draw as a normal wall (placeholder color)
            ctx.fillStyle = '#555';
            ctx.fillRect(screenX, screenY, width, height);

            // Add a crack if it requires a bomb (optional visual hint)
            if (!wall.requiresCandle) {
                ctx.strokeStyle = '#333';
                ctx.beginPath();
                ctx.moveTo(screenX + 8, screenY + 8);
                ctx.lineTo(screenX + 24, screenY + 24);
                ctx.stroke();
            }
        } else {
            // Revealed: draw as a dark opening
            ctx.fillStyle = '#000';
            ctx.fillRect(screenX, screenY, width, height);
        }
    }
}
