import { Camera } from './Camera';
import { ItemSprite } from './sprites/ItemSprite';

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
    private static LIFETIME = 10.0; // Items disappear after 10 seconds
    private sprite: ItemSprite;

    constructor(x: number, y: number, type: ItemType) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.sprite = new ItemSprite();

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
        // Flicker before disappearing
        if (this.timer > Item.LIFETIME - 2.0) {
            if (Math.floor(this.timer * 10) % 2 === 0) return;
        }

        // Use ItemSprite to render
        this.sprite.draw(
            ctx,
            0, // frameX
            0, // frameY
            0, // frameWidth
            0, // frameHeight
            this.width,
            this.height,
            this.type,
            camera,
            this.x,
            this.y
        );
    }

    public getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
