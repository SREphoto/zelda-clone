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

            this.hearts.draw(
                ctx,
                350 + (i % 8) * (heartWidth * scale + spacing), // Wrap after 8 hearts
                8 + Math.floor(i / 8) * 10,
                frameX, 0,
                heartWidth, heartHeight,
                heartWidth * scale,
                heartHeight * scale
            );
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
