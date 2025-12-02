import { Bomb } from '../Bomb';

export class BombSprite {
    constructor() {
    }

    /**
     * Draw a bomb with animated fuse based on timer.
     */
    public draw(
        ctx: CanvasRenderingContext2D,
        _frameX: number,
        _frameY: number,
        _frameWidth: number,
        _frameHeight: number,
        width: number,
        height: number,
        bomb: Bomb,
        camera: { x: number; y: number }
    ) {
        const sx = Math.floor(bomb.x - camera.x);
        const sy = Math.floor(bomb.y - camera.y);

        // Check if exploding (BombState.Exploding = 1)
        if (bomb.state === 1) {
            // Explosion
            ctx.fillStyle = Math.floor(Date.now() / 50) % 2 === 0 ? '#FF0000' : '#FFA500';

            // Draw expanding cloud
            ctx.beginPath();
            ctx.arc(sx + width / 2, sy + height / 2, width / 2, 0, Math.PI * 2);
            ctx.fill();

            // Inner white part
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(sx + width / 2, sy + height / 2, width / 3, 0, Math.PI * 2);
            ctx.fill();
            return;
        }

        // Bomb body (black circle)
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(sx + width / 2, sy + height / 2, 8, 0, Math.PI * 2);
        ctx.fill();

        // Fuse (animated - flickers as it burns down)
        const fuseFlicker = Math.floor(Date.now() / 100) % 2;
        ctx.strokeStyle = fuseFlicker ? '#FFA500' : '#FF4500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx + width / 2, sy + height / 2 - 8);
        ctx.lineTo(sx + width / 2, sy + height / 2 - 16);
        ctx.stroke();

        // Spark at fuse tip
        if (fuseFlicker) {
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(sx + width / 2, sy + height / 2 - 16, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
