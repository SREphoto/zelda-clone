import { NPCSprite, NPCType } from './sprites/NPCSprite';
import { FlameSprite } from './sprites/FlameSprite';

export const GameState = {
    TITLE_SCREEN: 0,
    PLAYING: 1,
    PAUSED: 2,
    GAME_OVER: 3,
    VICTORY: 4,
    CAVE: 5
} as const;

export type GameState = typeof GameState[keyof typeof GameState];

export class TitleScreen {
    private blinkTimer: number = 0;
    private showPressStart: boolean = true;

    public update(dt: number) {
        this.blinkTimer += dt;
        if (this.blinkTimer > 0.5) {
            this.showPressStart = !this.showPressStart;
            this.blinkTimer = 0;
        }
    }

    public render(ctx: CanvasRenderingContext2D, width: number, height: number) {
        // Black background
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, width, height);

        // Subtly glowing grid background
        ctx.strokeStyle = '#11111a';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 32) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 32) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw Triforce Logo
        const tx = width / 2;
        const ty = height / 3 - 40;
        const size = 60;

        // Glow
        const grad = ctx.createRadialGradient(tx, ty + size, 0, tx, ty + size, 150);
        grad.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
        grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(tx - 150, ty - 50, 300, 250);

        ctx.fillStyle = '#FFD700'; // Gold
        // Top
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - size / 2, ty + size);
        ctx.lineTo(tx + size / 2, ty + size);
        ctx.fill();
        // Bottom Left
        ctx.beginPath();
        ctx.moveTo(tx - size / 2, ty + size);
        ctx.lineTo(tx - size, ty + size * 2);
        ctx.lineTo(tx, ty + size * 2);
        ctx.fill();
        // Bottom Right
        ctx.beginPath();
        ctx.moveTo(tx + size / 2, ty + size);
        ctx.lineTo(tx, ty + size * 2);
        ctx.lineTo(tx + size, ty + size * 2);
        ctx.fill();

        // Title Text
        ctx.textAlign = 'center';

        // "THE LEGEND OF"
        ctx.font = '800 24px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('THE LEGEND OF', width / 2, height / 2 + 60);

        // "ZELDA"
        const titleY = height / 2 + 130;
        ctx.font = '900 80px Inter, system-ui, sans-serif';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillText('ZELDA', width / 2, titleY + 4);

        // Gradient for ZELDA
        const titleGrad = ctx.createLinearGradient(0, titleY - 60, 0, titleY);
        titleGrad.addColorStop(0, '#ffd700');
        titleGrad.addColorStop(1, '#ff8c00');
        ctx.fillStyle = titleGrad;
        ctx.fillText('ZELDA', width / 2, titleY);

        // Press Start (blinking)
        if (this.showPressStart) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 20px monospace';
            ctx.fillText('PRESS SPACE TO START', width / 2, height - 80);
        }

        // Controls summary
        ctx.fillStyle = '#666';
        ctx.font = '12px monospace';
        ctx.fillText('WASD: MOVE | SPACE: ATTACK | Z, X, B: ITEMS', width / 2, height - 40);
    }
}

export class GameOverScreen {
    public render(ctx: CanvasRenderingContext2D, width: number, height: number) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);

        // Game Over Text
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 72px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', width / 2, height / 2 - 50);

        // Retry Instructions
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px monospace';
        ctx.fillText('Press SPACE to retry', width / 2, height / 2 + 50);
        ctx.fillText('Press ESC for title screen', width / 2, height / 2 + 90);
    }
}

export class VictoryScreen {
    public render(ctx: CanvasRenderingContext2D, width: number, height: number) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, width, height);

        // Victory Text
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 64px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY!', width / 2, height / 2 - 100);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '32px monospace';
        ctx.fillText('You saved Hyrule!', width / 2, height / 2 - 30);

        // Triforce symbol
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2 + 20);
        ctx.lineTo(width / 2 - 40, height / 2 + 80);
        ctx.lineTo(width / 2 + 40, height / 2 + 80);
        ctx.fill();

        // Continue text
        ctx.fillStyle = '#AAAAAA';
        ctx.font = '20px monospace';
        ctx.fillText('Press SPACE to play again', width / 2, height / 2 + 150);
    }
}

export class CaveScreen {
    private npcSprite: NPCSprite;
    private flameSprite: FlameSprite;

    constructor() {
        this.npcSprite = new NPCSprite();
        this.flameSprite = new FlameSprite();
    }

    public render(ctx: CanvasRenderingContext2D, width: number, height: number, text: string, items: Array<{ type: number, price?: number }> | null, selectedIndex: number = 0, npcType: NPCType = NPCType.OldMan) {
        // Black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Walls (simple box)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(50, 50, width - 100, height - 100);

        // Render NPC
        // Center position
        const npcX = width / 2 - 16;
        const npcY = height / 2 - 48;

        if (npcType !== undefined) {
            this.npcSprite.draw(ctx, npcX, npcY, 32, 32, npcType);
        } else {
            // Default Fallback
            this.npcSprite.draw(ctx, npcX, npcY, 32, 32, NPCType.OldMan);
        }

        // Fire (Two flames next to NPC)
        // Left Fire
        this.flameSprite.draw(ctx, npcX - 48, npcY + 8, 16, 16);

        // Right Fire
        this.flameSprite.draw(ctx, npcX + 64, npcY + 8, 16, 16);


        // Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        this.renderText(ctx, text, width / 2, 150);
        ctx.textAlign = 'left';

        // Items (Shop)
        if (items) {
            const startX = width / 2 - (items.length * 60) / 2;
            items.forEach((item, index) => {
                const ix = startX + index * 60;
                const iy = 220;

                // Draw Price
                if (item.price) {
                    ctx.fillText(item.price.toString(), ix, iy - 20);
                    // Draw Rupee Icon next to price?
                }

                // Draw Item Placeholder (Circle for now if no sprite)
                ctx.fillStyle = '#00FF00';
                ctx.fillRect(ix, iy, 16, 16);

                if (index === selectedIndex) {
                    // Cursor
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(ix, iy + 24, 16, 8);
                }
            });
        }
    }

    private renderText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
        const lines = text.split('\n');
        lines.forEach((line, i) => {
            ctx.fillText(line, x, y + i * 20);
        });
    }
}
