import { Player } from './Player';

export class HUD {
    constructor() {
    }

    public render(ctx: CanvasRenderingContext2D, player: Player, rupees: number, bombs: number) {
        // Draw Background
        ctx.fillStyle = '#111116';
        ctx.fillRect(0, 0, ctx.canvas.width, 32);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, ctx.canvas.width, 32);

        ctx.textAlign = 'left';
        ctx.font = 'bold 14px Inter, system-ui, sans-serif';

        // Draw Rupees
        const rx = 15;
        const ry = 22;
        ctx.fillStyle = '#00FF00'; // Rupee Green
        ctx.beginPath();
        ctx.moveTo(rx, ry - 6);
        ctx.lineTo(rx + 4, ry - 10);
        ctx.lineTo(rx + 8, ry - 6);
        ctx.lineTo(rx + 8, ry + 2);
        ctx.lineTo(rx + 4, ry + 6);
        ctx.lineTo(rx, ry + 2);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.fillText(`${rupees}`, rx + 12, ry);

        // Draw Bombs
        const bx = 65;
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(bx + 5, ry - 3, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(bx + 4, ry - 10, 2, 3); // Fuse
        ctx.fillStyle = '#FFF';
        ctx.fillText(`${bombs}`, bx + 15, ry);

        // Draw Keys
        const kx = 115;
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(kx, ry - 8, 3, 10);
        ctx.fillRect(kx + 3, ry - 8, 5, 3);
        ctx.fillStyle = '#FFF';
        ctx.fillText(`${player.keys}`, kx + 12, ry);

        // Draw Hearts (Right aligned)
        const hx_start = ctx.canvas.width - (player.maxHealth * 18) - 10;
        const hy = 16;
        for (let i = 0; i < player.maxHealth; i++) {
            const hx = hx_start + i * 18;

            // Heart background (Empty)
            ctx.fillStyle = '#222';
            this.drawHeartShape(ctx, hx, hy, 12);

            if (player.health > i) {
                const fillRatio = Math.min(1, player.health - i);
                ctx.fillStyle = fillRatio < 1 ? '#FF8C00' : '#FF0000';
                this.drawHeartShape(ctx, hx, hy, 12);
            }
        }
    }

    private drawHeartShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
        ctx.beginPath();
        ctx.moveTo(x, y + size / 4);
        ctx.quadraticCurveTo(x, y, x + size / 4, y);
        ctx.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4);
        ctx.quadraticCurveTo(x + size / 2, y, x + size * 3 / 4, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + size / 4);
        ctx.quadraticCurveTo(x + size, y + size / 2, x + size / 2, y + size);
        ctx.quadraticCurveTo(x, y + size / 2, x, y + size / 4);
        ctx.fill();
    }
}
