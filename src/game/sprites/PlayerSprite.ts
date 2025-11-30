export class PlayerSprite {
    constructor() {
        // Call parent with a dummy image (null) because we will override draw
    }

    // Draw the player with optional equipment overlays
    // direction: 'up'|'down'|'left'|'right'
    // hasShield: boolean – draws a small shield on the side
    // swordLevel: 1-4 – changes sword color/size
    public draw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number = 32,
        height: number = 32,
        direction: 'up' | 'down' | 'left' | 'right' = 'down',
        hasShield: boolean = false,
        swordLevel: number = 1
    ) {
        // Base hero gradient
        const grad = ctx.createLinearGradient(x, y, x + width, y + height);
        grad.addColorStop(0, '#4A90E2'); // Light blue
        grad.addColorStop(1, '#003399'); // Dark blue
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, width, height);

        // Sword overlay – simple rectangle extending from the hero based on direction
        const swordColors = ['#C0C0C0', '#FFFFFF', '#4169E1', '#FFD700']; // Silver → Gold
        ctx.fillStyle = swordColors[Math.min(swordLevel - 1, swordColors.length - 1)];
        const swordThickness = 4;
        if (direction === 'up') {
            ctx.fillRect(x + width / 2 - swordThickness / 2, y - 12, swordThickness, 12);
        } else if (direction === 'down') {
            ctx.fillRect(x + width / 2 - swordThickness / 2, y + height, swordThickness, 12);
        } else if (direction === 'left') {
            ctx.fillRect(x - 12, y + height / 2 - swordThickness / 2, 12, swordThickness);
        } else { // right
            ctx.fillRect(x + width, y + height / 2 - swordThickness / 2, 12, swordThickness);
        }

        // Shield overlay – small circle on the opposite side of the sword
        if (hasShield) {
            ctx.fillStyle = '#FFD700'; // Gold shield
            const radius = 6;
            if (direction === 'up') {
                ctx.beginPath();
                ctx.arc(x + width / 2, y + height + radius, radius, 0, Math.PI * 2);
                ctx.fill();
            } else if (direction === 'down') {
                ctx.beginPath();
                ctx.arc(x + width / 2, y - radius, radius, 0, Math.PI * 2);
                ctx.fill();
            } else if (direction === 'left') {
                ctx.beginPath();
                ctx.arc(x + width + radius, y + height / 2, radius, 0, Math.PI * 2);
                ctx.fill();
            } else { // right
                ctx.beginPath();
                ctx.arc(x - radius, y + height / 2, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }
}
