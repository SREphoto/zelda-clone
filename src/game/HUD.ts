import { Sprite } from './Sprite';
import { Player } from './Player';
import heartsSrc from '../assets/hearts.png';

export class HUD {
    private hearts: Sprite;

    constructor() {
        this.hearts = new Sprite(heartsSrc);
    }

    public render(ctx: CanvasRenderingContext2D, player: Player, rupees: number, bombs: number) {
        // Draw Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, 32);

        // Draw Hearts
        const heartWidth = 8; // Source size
        const heartHeight = 8;
        const scale = 2;
        const spacing = 8;

        // Draw Max Health (Empty Hearts first)
        for (let i = 0; i < player.maxHealth; i++) {
            // Determine heart state
            // 0 = Full, 1 = Half, 2 = Empty
            let frameX = 2; // Empty

            if (player.health >= i + 1) {
                frameX = 0; // Full
            } else if (player.health > i) {
                frameX = 1; // Half
            }

            // Procedural Heart Drawing
            const hx = 350 + (i % 8) * (heartWidth * scale + spacing);
            const hy = 8 + Math.floor(i / 8) * 10;
            const size = heartWidth * scale;

            ctx.save();
            ctx.translate(hx, hy);

            // Draw Empty Heart Background
            ctx.fillStyle = '#000000'; // Black background
            ctx.fillRect(0, 0, size, size);

            // Draw Heart Outline (White)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(2, 0, 4, 2);
            ctx.fillRect(10, 0, 4, 2);
            ctx.fillRect(0, 2, 2, 4);
            ctx.fillRect(14, 2, 2, 4);
            ctx.fillRect(2, 6, 2, 2);
            ctx.fillRect(12, 6, 2, 2);
            ctx.fillRect(4, 8, 2, 2);
            ctx.fillRect(10, 8, 2, 2);
            ctx.fillRect(6, 10, 4, 2);
            ctx.fillRect(6, 12, 4, 2); // Point

            // Fill Heart based on state
            ctx.fillStyle = '#FF0000'; // Red

            if (frameX === 0) { // Full
                ctx.fillRect(2, 2, 4, 4);
                ctx.fillRect(10, 2, 4, 4);
                ctx.fillRect(2, 6, 12, 2);
                ctx.fillRect(4, 8, 8, 2);
                ctx.fillRect(6, 10, 4, 2);
            } else if (frameX === 1) { // Half
                ctx.fillRect(2, 2, 4, 4);
                ctx.fillRect(2, 6, 6, 2);
                ctx.fillRect(4, 8, 4, 2);
                ctx.fillRect(6, 10, 2, 2);
            }

            ctx.restore();
        }

        // Draw Rupees
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px monospace';
        ctx.fillText(`R: ${rupees}`, 100, 24);

        // Draw Bombs
        ctx.fillText(`B: ${bombs}`, 200, 24);

        // Draw Keys
        ctx.fillText(`K: ${player.keys}`, 280, 24);
    }
}
