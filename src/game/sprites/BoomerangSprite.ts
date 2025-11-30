import { Boomerang } from '../Boomerang';

export class BoomerangSprite {
    constructor() {
    }

    /**
     * Draw a boomerang with rotation animation.
     */
    public draw(
        ctx: CanvasRenderingContext2D,
        _frameX: number,
        _frameY: number,
        _frameWidth: number,
        _frameHeight: number,
        _width: number,
        _height: number,
        boomerang: Boomerang,
        camera: { x: number; y: number }
    ) {
        const sx = Math.floor(boomerang.x - camera.x);
        const sy = Math.floor(boomerang.y - camera.y);

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(boomerang.rotation);

        // Boomerang shape (golden/brown curved shape)
        ctx.fillStyle = '#8B4513';
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;

        // Draw boomerang as two curved arms
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.quadraticCurveTo(8, -8, 12, 0);
        ctx.lineTo(10, 2);
        ctx.quadraticCurveTo(6, -4, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.quadraticCurveTo(8, 8, 12, 0);
        ctx.lineTo(10, -2);
        ctx.quadraticCurveTo(6, 4, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}
