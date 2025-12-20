import { ItemType } from '../Item';
import { resources } from '../ResourceManager';

export class ItemSprite {
    constructor() {
    }

    /**
     * Draw an item based on its type.
     */
    public draw(
        ctx: CanvasRenderingContext2D,
        _frameX: number,
        _frameY: number,
        _frameWidth: number,
        _frameHeight: number,
        _width: number,
        _height: number,
        itemType: number,
        camera: { x: number; y: number },
        x: number,
        y: number
    ) {
        const screenX = Math.floor(x - camera.x);
        const screenY = Math.floor(y - camera.y);
        const size = 16; // Sprites are likely 16x16, though items in world might be 8x8 or 16x16. Let's assume 8x8 rendered size or 16x16. Original code used size=8 for rects. Standard Zelda items are 8x16 or 16x16.

        const itemsImg = resources.getImage('/assets/items.png');
        if (itemsImg) {
            let tx = -1;
            let ty = 0;
            switch (itemType) {
                // "Sword, Shield, Rupee (Green, Blue), Bomb, Bow, Arrow, Boomerang, Heart, Key, Map, Compass, Triforce Piece."
                case ItemType.MagicalShield: tx = 1; break;
                case ItemType.RupeeGreen: tx = 2; break;
                case ItemType.RupeeBlue: tx = 3; break;
                case ItemType.FiveRupee: tx = 3; break; // Reuse Blue
                case ItemType.Bomb: tx = 4; break;
                // Bow not in Enum?
                case ItemType.SilverArrow: tx = 6; break; // Arrow
                case ItemType.Boomerang: tx = 7; break;
                case ItemType.Heart: tx = 8; break;
                case ItemType.Key: tx = 9; break;
                case ItemType.Map: tx = 10; break;
                case ItemType.Compass: tx = 11; break;
                case ItemType.Triforce: tx = 12; break;

                // Missing in Sprite Sheet (Fallback to procedural or mapping to "unknown")
                // Fairy, Candle, Ladder, MagicRod, Rings, HeartContainer, Clock
            }

            if (tx >= 0) {
                // TEMPORARY: Scale entire image
                // ctx.drawImage(itemsImg, tx * 16, ty * 16, 16, 16, screenX, screenY, 16, 16);
                ctx.drawImage(itemsImg, screenX, screenY, 16, 16);
                return;
            }
        }

        // Fallback or Non-Sprite Items
        this.drawProcedural(ctx, screenX, screenY, itemType, size);
    }

    private drawProcedural(ctx: CanvasRenderingContext2D, screenX: number, screenY: number, itemType: number, size: number) {
        // Re-implement or call existing logic
        switch (itemType) {
            case ItemType.Fairy:
                ctx.fillStyle = '#FF69B4';
                ctx.beginPath();
                ctx.arc(screenX + size / 2, screenY + size / 2, size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fillRect(screenX - 2, screenY + 2, 3, 4);
                ctx.fillRect(screenX + size - 1, screenY + 2, 3, 4);
                break;
            case ItemType.Candle:
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(screenX + size / 4, screenY + 2, size / 2, size - 2);
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(screenX + size / 4 - 1, screenY, size / 2 + 2, 3);
                break;
            case ItemType.Ladder:
                ctx.fillStyle = '#A0522D';
                ctx.fillRect(screenX, screenY, 2, size);
                ctx.fillRect(screenX + size - 2, screenY, 2, size);
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(screenX + 2, screenY + i * 3, size - 4, 1);
                }
                break;
            case ItemType.MagicRod:
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(screenX + size / 3, screenY, size / 3, size);
                ctx.fillStyle = '#FF4500';
                ctx.fillRect(screenX + size / 3 - 1, screenY, size / 3 + 2, 2);
                break;
            case ItemType.BlueRing:
                ctx.strokeStyle = '#4169E1';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(screenX + size / 2, screenY + size / 2, size / 2, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case ItemType.RedRing:
                ctx.strokeStyle = '#FF0000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(screenX + size / 2, screenY + size / 2, size / 2, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case ItemType.HeartContainer:
                ctx.fillStyle = '#FF0000';
                this.drawHeart(ctx, screenX, screenY);
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.strokeRect(screenX - 1, screenY - 1, size + 2, size + 2);
                break;
            case ItemType.Clock:
                this.drawClock(ctx, screenX, screenY, size);
                break;
            default:
                // For unmapped items that had procedural before (but I might have missed copying them all above, e.g. simple rects)
                ctx.fillStyle = '#FFF';
                ctx.fillRect(screenX, screenY, size, size);
        }
    }

    private drawClock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
        ctx.fillStyle = '#FFFFFF'; // White face
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#000000'; // Border
        ctx.strokeRect(x, y, size, size);

        // Hands
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Hour hand
        ctx.moveTo(x + size / 2, y + size / 2);
        ctx.lineTo(x + size / 2, y + 2);
        // Minute hand
        ctx.moveTo(x + size / 2, y + size / 2);
        ctx.lineTo(x + size - 2, y + size / 2);
        ctx.stroke();

        // Rim
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 1, y - 1, size + 2, size + 2);
    }

    private drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number) {
        const size = 8;
        ctx.fillRect(x + 1, y, 2, 1);
        ctx.fillRect(x + 5, y, 2, 1);
        ctx.fillRect(x, y + 1, 4, 1);
        ctx.fillRect(x + 4, y + 1, 4, 1);
        ctx.fillRect(x, y + 2, size, 1);
        ctx.fillRect(x, y + 3, size, 1);
        ctx.fillRect(x + 1, y + 4, size - 2, 1);
        ctx.fillRect(x + 2, y + 5, size - 4, 1);
        ctx.fillRect(x + 3, y + 6, size - 6, 1);
    }

    private drawRupee(ctx: CanvasRenderingContext2D, x: number, y: number) {
        const size = 8;
        // Diamond shape
        ctx.beginPath();
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size, y + size / 2);
        ctx.lineTo(x + size / 2, y + size);
        ctx.lineTo(x, y + size / 2);
        ctx.closePath();
        ctx.fill();
    }
}
