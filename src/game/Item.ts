import { Camera } from './Camera';

export const ItemType = {
    Heart: 0,
    RupeeGreen: 1,
    RupeeBlue: 2,
    Fairy: 3,
    Bomb: 4,
    Clock: 5,
    FiveRupee: 6,
    MagicalShield: 7,
    SilverArrow: 8,
    Triforce: 9,
    Boomerang: 10,
    Compass: 11,
    Map: 12,
    Key: 13,
    Candle: 14,
    Ladder: 15,
    MagicRod: 16,
    BlueRing: 17,
    RedRing: 18,
    HeartContainer: 19
} as const;
export type ItemType = typeof ItemType[keyof typeof ItemType];

export class Item {
    // ... (existing properties)
    public x: number;
    public y: number;
    public width: number = 8;
    public height: number = 16;
    public type: ItemType;
    public shouldRemove: boolean = false;

    private timer: number = 0;
    private static LIFETIME = 10.0; // Items disappear after 10 seconds (approx)

    constructor(x: number, y: number, type: ItemType) {
        this.x = x;
        this.y = y;
        this.type = type;

        // Adjust size based on type if needed
        if (this.type === ItemType.Heart) {
            this.width = 8;
            this.height = 8;
        }
    }

    public update(dt: number) {
        this.timer += dt;
        if (this.timer >= Item.LIFETIME) {
            this.shouldRemove = true;
        }
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera) {
        const screenX = Math.floor(this.x - camera.x);
        const screenY = Math.floor(this.y - camera.y);

        // Flicker before disappearing
        if (this.timer > Item.LIFETIME - 2.0) {
            if (Math.floor(this.timer * 10) % 2 === 0) return;
        }

        // Placeholder Rendering until we have sprites
        switch (this.type) {
            case ItemType.Heart:
                ctx.fillStyle = 'red';
                this.drawHeart(ctx, screenX, screenY);
                break;
            case ItemType.RupeeGreen:
                ctx.fillStyle = '#00E000'; // Green
                this.drawRupee(ctx, screenX, screenY);
                break;
            case ItemType.RupeeBlue:
                ctx.fillStyle = '#4040FF'; // Blue
                this.drawRupee(ctx, screenX, screenY);
                break;
            case ItemType.FiveRupee:
                ctx.fillStyle = '#4040FF'; // Blue (5 rupees are usually blue in NES Zelda 1 drop table context, or flashing)
                this.drawRupee(ctx, screenX, screenY);
                break;
            case ItemType.Fairy:
                ctx.fillStyle = 'pink';
                ctx.fillRect(screenX, screenY, 8, 16);
                break;
            case ItemType.Bomb:
                ctx.fillStyle = 'blue';
                ctx.beginPath();
                ctx.arc(screenX + 4, screenY + 8, 6, 0, Math.PI * 2);
                ctx.fill();
                break;
            case ItemType.MagicalShield:
                ctx.fillStyle = '#DDDDDD'; // White/Silver
                ctx.fillRect(screenX, screenY, 8, 16);
                ctx.fillStyle = '#0000AA'; // Blue Cross
                ctx.fillRect(screenX + 2, screenY + 2, 4, 12);
                ctx.fillRect(screenX, screenY + 6, 8, 4);
                break;
            case ItemType.SilverArrow:
                ctx.fillStyle = '#C0C0C0'; // Silver
                ctx.fillRect(screenX + 3, screenY, 2, 16);
                ctx.beginPath();
                ctx.moveTo(screenX + 4, screenY);
                ctx.lineTo(screenX, screenY + 4);
                ctx.lineTo(screenX + 8, screenY + 4);
                ctx.fill();
                break;
            case ItemType.Triforce:
                ctx.fillStyle = '#FFFF00'; // Yellow
                ctx.beginPath();
                ctx.moveTo(screenX + 4, screenY);
                ctx.lineTo(screenX, screenY + 8);
                ctx.lineTo(screenX + 8, screenY + 8);
                ctx.fill();
                break;
            case ItemType.Boomerang:
                ctx.fillStyle = '#8B4513'; // Brown
                ctx.fillRect(screenX + 1, screenY + 7, 6, 2);
                ctx.fillRect(screenX + 3, screenY + 5, 2, 6);
                break;
            case ItemType.Compass:
                ctx.fillStyle = '#FFD700'; // Gold
                ctx.beginPath();
                ctx.arc(screenX + 4, screenY + 8, 6, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.moveTo(screenX + 4, screenY + 4);
                ctx.lineTo(screenX + 4, screenY + 8);
                ctx.stroke();
                break;
            case ItemType.Map:
                ctx.fillStyle = '#EEEEEE';
                ctx.fillRect(screenX, screenY + 4, 8, 8);
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX, screenY + 4, 8, 8);
                break;
            case ItemType.Key:
                ctx.fillStyle = '#FFD700'; // Gold
                ctx.fillRect(screenX + 2, screenY, 4, 12);
                ctx.fillRect(screenX, screenY + 10, 8, 2);
                break;
            case ItemType.Candle:
                ctx.fillStyle = '#FFFFFF'; // White candle
                ctx.fillRect(screenX + 3, screenY + 4, 2, 8);
                ctx.fillStyle = '#FFD700'; // Flame
                ctx.fillRect(screenX + 2, screenY + 2, 4, 3);
                break;
            case ItemType.Ladder:
                ctx.fillStyle = '#8B4513'; // Brown
                ctx.fillRect(screenX, screenY, 2, 16);
                ctx.fillRect(screenX + 6, screenY, 2, 16);
                ctx.fillRect(screenX + 2, screenY + 3, 4, 1);
                ctx.fillRect(screenX + 2, screenY + 8, 4, 1);
                ctx.fillRect(screenX + 2, screenY + 13, 4, 1);
                break;
            case ItemType.MagicRod:
                ctx.fillStyle = '#8B4513'; // Brown rod
                ctx.fillRect(screenX + 3, screenY, 2, 14);
                ctx.fillStyle = '#FF0000'; // Red tip
                ctx.fillRect(screenX + 2, screenY, 4, 2);
                break;
            case ItemType.BlueRing:
                ctx.strokeStyle = '#4040FF'; // Blue
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(screenX + 4, screenY + 8, 5, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case ItemType.RedRing:
                ctx.strokeStyle = '#FF0000'; // Red
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(screenX + 4, screenY + 8, 5, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case ItemType.HeartContainer:
                // Draw larger, bordered heart
                ctx.fillStyle = '#FF0000'; // Red
                this.drawHeart(ctx, screenX, screenY + 4);
                ctx.strokeStyle = '#FFD700'; // Gold border
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX - 1, screenY + 3, 10, 8);
                break;
            default:
                ctx.fillStyle = 'white';
                ctx.fillRect(screenX, screenY, 8, 16);
        }
    }

    private drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillRect(x + 1, y, 2, 1);
        ctx.fillRect(x + 5, y, 2, 1);
        ctx.fillRect(x, y + 1, 4, 1);
        ctx.fillRect(x + 4, y + 1, 4, 1);
        ctx.fillRect(x, y + 2, 8, 1);
        ctx.fillRect(x + 1, y + 3, 6, 1);
        ctx.fillRect(x + 2, y + 4, 4, 1);
        ctx.fillRect(x + 3, y + 5, 2, 1);
    }

    private drawRupee(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillRect(x + 2, y, 4, 16);
        ctx.fillRect(x + 1, y + 2, 6, 12);
        ctx.fillRect(x, y + 4, 8, 8);
    }

    public getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
