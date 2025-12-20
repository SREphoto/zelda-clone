export class FlameSprite {
    constructor() {
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        const t = Date.now() / 100;

        // Base flicker
        ctx.fillStyle = '#FF0000';
        const flicker = Math.sin(t) * 2;

        ctx.fillRect(x + flicker, y + 2, width, height - 2);

        // Inner core
        ctx.fillStyle = '#FF8C00'; // Dark Orange
        ctx.fillRect(x + 2 + flicker, y + 4, width - 4, height - 6);

        // Center hot spot
        ctx.fillStyle = '#FFFF00';
        const innerFlicker = Math.cos(t * 2) * 2;
        ctx.fillRect(x + 4 + innerFlicker, y + 8, width - 8, height - 10);
    }
}
