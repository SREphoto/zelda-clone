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
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Title
        ctx.fillStyle = '#FFD700'; // Gold
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('THE LEGEND OF', width / 2, height / 3);

        ctx.fillStyle = '#FF0000'; // Red
        ctx.font = 'bold 64px monospace';
        ctx.fillText('ZELDA', width / 2, height / 3 + 70);

        // Subtitle
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px monospace';
        ctx.fillText('A Zelda-Inspired Adventure', width / 2, height / 3 + 120);

        // Press Start (blinking)
        if (this.showPressStart) {
            ctx.fillStyle = '#00FF00';
            ctx.font = 'bold 24px monospace';
            ctx.fillText('PRESS SPACE TO START', width / 2, height / 2 + 100);
        }

        // Controls
        ctx.fillStyle = '#AAAAAA';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        const controlsX = width / 2 - 150;
        const controlsY = height - 150;

        ctx.fillText('CONTROLS:', controlsX, controlsY);
        ctx.fillText('Arrow Keys / WASD - Move', controlsX, controlsY + 25);
        ctx.fillText('Space - Attack', controlsX, controlsY + 50);
        ctx.fillText('Z - Place Bomb', controlsX, controlsY + 75);
        ctx.fillText('X - Shoot Arrow', controlsX, controlsY + 100);
        ctx.fillText('B - Throw Boomerang', controlsX, controlsY + 125);
        ctx.fillText('M - View Map', controlsX, controlsY + 150);
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
    public render(ctx: CanvasRenderingContext2D, width: number, height: number, text: string, items: Array<{ type: any, price?: number }> | null, selectedIndex: number = 0) {
        // Black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Walls (simple box)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(50, 50, width - 100, height - 100);

        // Old Man / Woman / Merchant (Red/White square for now)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(width / 2 - 16, height / 2 - 48, 32, 32);

        // Fire (Two red/orange squares)
        const time = Date.now();
        const flicker = Math.sin(time / 100) > 0;
        ctx.fillStyle = flicker ? '#FF4400' : '#FF8800';
        ctx.fillRect(width / 2 - 64, height / 2 - 48, 32, 32);
        ctx.fillRect(width / 2 + 32, height / 2 - 48, 32, 32);

        // Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, width / 2, height / 2 - 90);

        // Items
        if (items && items.length > 0) {
            const startX = width / 2 - ((items.length - 1) * 60) / 2;

            items.forEach((item, index) => {
                const x = startX + index * 60;
                const y = height / 2 + 30;

                // Selection Highlight
                if (index === selectedIndex) {
                    ctx.fillStyle = '#FFFF00'; // Yellow highlight
                    ctx.fillRect(x - 20, y - 20, 40, 40);
                }

                // Draw item (placeholder circle if no sprite)
                ctx.fillStyle = '#00FF00'; // Green item
                ctx.beginPath();
                ctx.arc(x, y, 16, 0, Math.PI * 2);
                ctx.fill();

                // Price
                if (item.price !== undefined) {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '16px monospace';
                    ctx.fillText(item.price.toString(), x, y + 30);

                    // Rupee symbol (simple X)
                    ctx.font = '12px monospace';
                    ctx.fillText('X', x - 15, y + 30);
                }
            });

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px monospace';
            ctx.fillText('SELECT WITH ARROWS, SPACE TO BUY/TAKE', width / 2, height / 2 + 100);
        }
    }
}
