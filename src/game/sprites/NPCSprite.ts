
export const NPCType = {
    OldMan: 0,
    Merchant: 1,
    OldWoman: 2,
    Zelda: 3,
    Moblin: 4, // "It's a secret to everybody"
    Fairy: 5
} as const;

export type NPCType = typeof NPCType[keyof typeof NPCType];

export class NPCSprite {
    constructor() {
    }

    public draw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        type: NPCType
    ) {
        ctx.save();
        ctx.translate(x, y);

        switch (type) {
            case NPCType.OldMan:
                this.drawOldMan(ctx, width, height);
                break;
            case NPCType.Merchant:
                this.drawMerchant(ctx, width, height);
                break;
            case NPCType.OldWoman:
                this.drawOldWoman(ctx, width, height);
                break;
            case NPCType.Zelda:
                this.drawZelda(ctx, width, height);
                break;
            case NPCType.Moblin:
                this.drawMoblin(ctx, width, height);
                break;
            case NPCType.Fairy:
                this.drawFairy(ctx, width, height);
                break;
            default:
                // Fallback
                ctx.fillStyle = '#FF00FF';
                ctx.fillRect(0, 0, width, height);
        }

        ctx.restore();
    }

    private drawOldMan(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Robe
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(4, 4, w - 8, h - 4);

        // Face
        ctx.fillStyle = '#FFDAB9'; // Peach
        ctx.fillRect(8, 6, w - 16, 6);

        // Beard
        ctx.fillStyle = '#C0C0C0'; // Grey/White
        ctx.fillRect(6, 12, w - 12, 4);

        // Eyes (black dots)
        ctx.fillStyle = '#000000';
        ctx.fillRect(10, 8, 2, 2);
        ctx.fillRect(w - 12, 8, 2, 2);
    }

    private drawMerchant(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Robe (Greenish?) Or just like Old Man but different color?
        // NES Merchant is basically Old Man sprite. Sometimes different palette.
        // Let's make him Blue/White.
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(4, 4, w - 8, h - 4);

        // Face
        ctx.fillStyle = '#FFDAB9';
        ctx.fillRect(8, 6, w - 16, 6);

        // Beard - darker?
        ctx.fillStyle = '#808080';
        ctx.fillRect(6, 12, w - 12, 4);

        // Arms crossed?
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(4, 14, 4, 6);
        ctx.fillRect(w - 8, 14, 4, 6);
    }

    private drawOldWoman(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Hood
        ctx.fillStyle = '#FF4500'; // Red-Orange
        ctx.fillRect(4, 4, w - 8, h - 4);

        // Face
        ctx.fillStyle = '#FFDAB9';
        ctx.fillRect(8, 8, w - 16, 6);

        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(10, 10, 2, 2);
        ctx.fillRect(w - 12, 10, 2, 2);
    }

    private drawZelda(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Dress
        ctx.fillStyle = '#FF69B4'; // Pink
        ctx.fillRect(4, 8, w - 8, h - 8);

        // Hair
        ctx.fillStyle = '#8B4513'; // Brown
        ctx.fillRect(4, 2, w - 8, 8);

        // Face
        ctx.fillStyle = '#FFDAB9';
        ctx.fillRect(8, 6, w - 16, 6);

        // Eyes
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(10, 8, 2, 2);
        ctx.fillRect(w - 12, 8, 2, 2);
    }

    private drawMoblin(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Secret Moblin
        ctx.fillStyle = '#FF0000'; // Red Skin
        ctx.fillRect(4, 4, w - 8, h - 4);

        ctx.fillStyle = '#FFFFFF'; // Eyes
        ctx.fillRect(8, 8, 4, 4);
        ctx.fillRect(w - 12, 8, 4, 4);

        ctx.fillStyle = '#000000'; // Pupils
        ctx.fillRect(10, 10, 2, 2);
        ctx.fillRect(w - 10, 10, 2, 2);

        // Snout
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(12, 14, 8, 4);
    }

    private drawFairy(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 6, 0, Math.PI * 2);
        ctx.fill();

        // Wings
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        // Flapping
        const flap = Math.floor(Date.now() / 50) % 2;
        if (flap) {
            ctx.fillRect(0, 4, 8, 12);
            ctx.fillRect(w - 8, 4, 8, 12);
        } else {
            ctx.fillRect(0, 8, 8, 8);
            ctx.fillRect(w - 8, 8, 8, 8);
        }
    }
}
