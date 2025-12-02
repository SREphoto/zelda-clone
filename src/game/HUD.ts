import { Player } from './Player';

export class HUD {
    constructor() {
    }

    public render(ctx: CanvasRenderingContext2D, player: Player, rupees: number, bombs: number) {
        // Draw Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, 32);

        // Draw Hearts
        const heartWidth = 8; // Source size
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
        const rx = 100;
        const ry = 8;
        // Icon
        ctx.fillStyle = '#DAA520'; // Gold
        ctx.beginPath();
        ctx.moveTo(rx + 6, ry);
        ctx.lineTo(rx + 12, ry + 8);
        ctx.lineTo(rx + 6, ry + 16);
        ctx.lineTo(rx, ry + 8);
        ctx.fill();
        // Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px monospace';
        ctx.fillText(`X${rupees}`, rx + 16, 24);

        // Draw Bombs
        const bx = 180;
        // Icon
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(bx + 8, ry + 8, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFA500'; // Fuse
        ctx.fillRect(bx + 7, ry - 2, 2, 4);
        // Text
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`X${bombs}`, bx + 18, 24);

        // Draw Keys
        const kx = 260;
        // Icon
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(kx + 4, ry, 4, 10); // Shaft
        ctx.fillRect(kx + 2, ry, 8, 4); // Handle
        ctx.fillRect(kx + 4, ry + 10, 6, 2); // Teeth
        ctx.fillRect(kx + 4, ry + 13, 4, 2);
        // Text
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`X${player.keys}`, kx + 16, 24);
    }
}
