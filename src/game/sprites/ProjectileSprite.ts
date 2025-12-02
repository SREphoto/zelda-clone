import { Projectile } from '../Projectile';

export class ProjectileSprite {
    constructor() {
    }

    /**
     * Draw enemy projectile (typically a fireball or rock).
     */
    public draw(
        ctx: CanvasRenderingContext2D,
        _frameX: number,
        _frameY: number,
        _frameWidth: number,
        _frameHeight: number,
        width: number,
        height: number,
        projectile: Projectile,
        camera: { x: number; y: number }
    ) {
        const sx = Math.floor(projectile.x - camera.x);
        const sy = Math.floor(projectile.y - camera.y);

        // Draw as a fiery orb or magic orb
        const gradient = ctx.createRadialGradient(
            sx + width / 2, sy + height / 2, 0,
            sx + width / 2, sy + height / 2, width / 2
        );

        if (projectile.isMagic) {
            // Magic Orb (Cyan/Blue)
            gradient.addColorStop(0, '#E0FFFF'); // Light Cyan
            gradient.addColorStop(0.5, '#00FFFF'); // Cyan
            gradient.addColorStop(1, '#00008B'); // Dark Blue
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        } else {
            // Fireball (Red/Orange)
            gradient.addColorStop(0, '#FFFF00'); // Yellow center
            gradient.addColorStop(0.5, '#FF4500'); // Orange-red
            gradient.addColorStop(1, '#8B0000'); // Dark red edge
            ctx.strokeStyle = 'rgba(255, 100, 0, 0.5)';
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sx + width / 2, sy + height / 2, width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Outer glow
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx + width / 2, sy + height / 2, width / 2 + 2, 0, Math.PI * 2);
        ctx.stroke();
    }
}
