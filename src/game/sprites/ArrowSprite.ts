import { Sprite } from '../Sprite';
import { Arrow } from '../Arrow';

export class ArrowSprite extends Sprite {
    constructor() {
        super('');
    }

    /**
     * Draw an arrow with rotation based on direction.
     */
    public draw(
        ctx: CanvasRenderingContext2D,
        _frameX: number,
        _frameY: number,
        _frameWidth: number,
        _frameHeight: number,
        _width: number,
        _height: number,
        arrow: Arrow,
        camera: { x: number; y: number }
    ) {
        const sx = Math.floor(arrow.x - camera.x);
        const sy = Math.floor(arrow.y - camera.y);

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(arrow.rotation);

        // Arrow color (silver or white)
        ctx.fillStyle = arrow.isSilver ? '#C0C0C0' : '#FFFFFF';

        // Shaft
        ctx.fillRect(-2, -8, 4, 16);

        // Arrowhead (triangle)
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(5, -2);
        ctx.lineTo(-5, -2);
        ctx.closePath();
        ctx.fill();

        // Fletching (small triangles at back)
        ctx.fillStyle = arrow.isSilver ? '#A0A0A0' : '#CCCCCC';
        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.lineTo(3, 6);
        ctx.lineTo(-3, 6);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}
