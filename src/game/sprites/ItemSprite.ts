import { Sprite } from '../Sprite';
import { ItemType } from '../Item';

export class ItemSprite extends Sprite {
    constructor() {
        super(''); // No image, draw manually
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
        width: number,
        height: number,
        itemType: number,
        camera: { x: number; y: number },
        x: number,
        y: number
    ) {
        const screenX = Math.floor(x - camera.x);
        const screenY = Math.floor(y - camera.y);
        const size = 8;

        const drawSquare = (color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(screenX, screenY, size, size);
        };

        switch (itemType) {
            case ItemType.Heart:
                ctx.fillStyle = '#FF0000';
                this.drawHeart(ctx, screenX, screenY);
                break;
            case ItemType.RupeeGreen:
                ctx.fillStyle = '#00FF00';
                this.drawRupee(ctx, screenX, screenY);
                break;
            case ItemType.RupeeBlue:
                ctx.fillStyle = '#0000FF';
                this.drawRupee(ctx, screenX, screenY);
                break;
            case ItemType.FiveRupee:
                ctx.fillStyle = '#0000FF';
                this.drawRupee(ctx, screenX, screenY);
                break;
            case ItemType.Fairy:
                ctx.fillStyle = '#FF69B4';
                ctx.beginPath();
                ctx.arc(screenX + size / 2, screenY + size / 2, size / 2, 0, Math.PI * 2);
                ctx.fill();
                // Wings
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fillRect(screenX - 2, screenY + 2, 3, 4);
                ctx.fillRect(screenX + size - 1, screenY + 2, 3, 4);
                break;
            case ItemType.Bomb:
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.arc(screenX + size / 2, screenY + size / 2, size / 2, 0, Math.PI * 2);
                ctx.fill();
                // Fuse
                ctx.strokeStyle = '#FFA500';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(screenX + size / 2, screenY);
                ctx.lineTo(screenX + size / 2, screenY - 4);
                ctx.stroke();
                break;
            case ItemType.Boomerang:
                ctx.fillStyle = '#8B4513';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY + size / 2);
                ctx.quadraticCurveTo(screenX + size / 2, screenY - size / 2, screenX + size, screenY + size / 2);
                ctx.quadraticCurveTo(screenX + size / 2, screenY + size * 1.5, screenX, screenY + size / 2);
                ctx.fill();
                break;
            case ItemType.SilverArrow:
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(screenX + 2, screenY, 4, size);
                ctx.beginPath();
                ctx.moveTo(screenX + 4, screenY - 2);
                ctx.lineTo(screenX, screenY + 2);
                ctx.lineTo(screenX + 8, screenY + 2);
                ctx.closePath();
                ctx.fill();
                break;
            case ItemType.Compass:
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(screenX + size / 2, screenY + size / 2, size / 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(screenX + size / 2 - 1, screenY, 2, size / 2);
                break;
            case ItemType.Map:
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(screenX, screenY, size, size);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX, screenY, size, size);
                break;
            case ItemType.Key:
                ctx.fillStyle = '#DAA520';
                ctx.fillRect(screenX + 2, screenY, size - 4, size);
                ctx.fillRect(screenX, screenY + size - 3, size / 2, 3);
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
            case ItemType.MagicalShield:
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(screenX, screenY, size, size);
                ctx.fillStyle = '#4169E1';
                ctx.fillRect(screenX + 2, screenY + 1, size - 4, size - 2);
                break;
            case ItemType.Triforce:
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.moveTo(screenX + size / 2, screenY);
                ctx.lineTo(screenX, screenY + size);
                ctx.lineTo(screenX + size, screenY + size);
                ctx.closePath();
                ctx.fill();
                break;
            default:
                drawSquare('#FFF');
        }
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
