import { Sprite } from '../Sprite';
import { Enemy } from '../Enemy';

export class EnemySprite extends Sprite {
    constructor() {
        super(''); // No image, we draw manually
    }

    /**
     * Draw an enemy.
     * Parameters after the frame args are unused – we only need width/height and the Enemy instance.
     */
    public draw(
        ctx: CanvasRenderingContext2D,
        _frameX: number,
        _frameY: number,
        _frameWidth: number,
        _frameHeight: number,
        width: number,
        height: number,
        enemy: Enemy,
        camera: { x: number; y: number }
    ) {
        const sx = Math.floor(enemy.x - camera.x);
        const sy = Math.floor(enemy.y - camera.y);

        const grad = ctx.createLinearGradient(sx, sy, sx + width, sy + height);
        grad.addColorStop(0, '#FF7F50'); // Coral
        grad.addColorStop(1, '#B22222'); // Firebrick
        ctx.fillStyle = grad;
        ctx.fillRect(sx, sy, width, height);

        // Simple enemy icon – a ⚔️ emoji centered
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚔️', sx + width / 2, sy + height / 1.6);
    }
}
