export const GameState = {
    TITLE_SCREEN: 0,
    PLAYING: 1,
    PAUSED: 2,
    GAME_OVER: 3,
    VICTORY: 4
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
