import { Player } from './Player';

export class HUD {
    private heartSize: number = 8;
    private padding: number = 2;

    constructor() { }

    public render(ctx: CanvasRenderingContext2D, player: Player, rupees: number, bombs: number) {
        // Draw HUD Background (Top Overlay)
        const hudHeight = 32;
        const width = ctx.canvas.width;

        // Save context
        ctx.save();

        // Reset transform to draw fixed UI
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, hudHeight);

        // Draw Hearts
        this.drawHearts(ctx, player, 176, 8);

        // Draw Counters
        this.drawCounters(ctx, rupees, bombs, 64, 8);

        // Draw Equipped Item
        this.drawEquippedItem(ctx, bombs, 128, 8);

        // Minimap Placeholder
        ctx.fillStyle = '#555';
        ctx.fillRect(16, 4, 32, 24);

        ctx.restore();
    }

    private drawHearts(ctx: CanvasRenderingContext2D, player: Player, x: number, y: number) {
        const fullHearts = Math.floor(player.health);
        const halfHeart = player.health % 1 >= 0.5;
        const maxHearts = player.maxHealth;

        for (let i = 0; i < maxHearts; i++) {
            const hx = x + i * (this.heartSize + this.padding);

            ctx.fillStyle = '#440000'; // Empty Heart Background
            this.drawHeartShape(ctx, hx, y);

            if (i < fullHearts) {
                ctx.fillStyle = '#FF0000'; // Full Heart
                this.drawHeartShape(ctx, hx, y);
            } else if (i === fullHearts && halfHeart) {
                ctx.fillStyle = '#FF0000'; // Half Heart
                ctx.save();
                ctx.beginPath();
                ctx.rect(hx, y, this.heartSize / 2, this.heartSize);
                ctx.clip();
                this.drawHeartShape(ctx, hx, y);
                ctx.restore();
            }
        }
    }

    private drawHeartShape(ctx: CanvasRenderingContext2D, x: number, y: number) {
        // Simple 8x8 Heart
        ctx.fillRect(x + 1, y, 2, 1);
        ctx.fillRect(x + 5, y, 2, 1);
        ctx.fillRect(x, y + 1, 4, 1);
        ctx.fillRect(x + 4, y + 1, 4, 1);
        ctx.fillRect(x, y + 2, 8, 1);
        ctx.fillRect(x + 1, y + 3, 6, 1);
        ctx.fillRect(x + 2, y + 4, 4, 1);
        ctx.fillRect(x + 3, y + 5, 2, 1);
    }

    private drawCounters(ctx: CanvasRenderingContext2D, rupees: number, bombs: number, x: number, y: number) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px monospace';

        // Rupees (R)
        ctx.fillStyle = '#00E000'; // Green
        ctx.fillText(`$${rupees}`, x, y + 8);

        // Bombs (B)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`B${bombs}`, x, y + 20);
    }

    private drawEquippedItem(ctx: CanvasRenderingContext2D, bombs: number, x: number, y: number) {
        // B Box
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(x, y, 16, 16);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px monospace';
        ctx.fillText('B', x + 2, y - 2);

        // Draw Bomb or Bow icon if equipped?
        // For now, just show text based on what we have
        if (bombs > 0) {
            // Draw Bomb Icon
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(x + 8, y + 8, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
