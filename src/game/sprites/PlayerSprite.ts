import { resources } from '../ResourceManager';

export class PlayerSprite {
    constructor() {
    }

    public draw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        _direction: 'up' | 'down' | 'left' | 'right',
        _isAttacking: boolean,
        _swordLevel: number,
        _shieldLevel: number,
        _defenseRing: number,
        frame: number
    ) {
        const img = resources.getImage('/assets/link.png');
        if (!img) {
            // Fallback (Red Box) if image not loaded
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, width, height);
            return;
        }

        // Calculate Source Rect
        // Assuming 256x256 frames in a 4x4 grid (1024x1024 sheet)
        const frameSize = 256;
        const sx = (frame % 4) * frameSize;
        const sy = Math.floor(frame / 4) * frameSize;

        // Draw Sprite
        ctx.drawImage(img, sx, sy, frameSize, frameSize, x, y, width, height);
    }
}
