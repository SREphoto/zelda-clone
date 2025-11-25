import { Sprite } from './Sprite';
import { Camera } from './Camera';
import { Tilemap } from './Tilemap';

export class Projectile {
    public x: number;
    public y: number;
    public width: number = 8;
    public height: number = 8;
    public speed: number;
    public direction: { x: number, y: number };
    public damage: number;
    public shouldRemove: boolean = false;
    public isMagic: boolean = false;

    private sprite: Sprite | null = null;
    private color: string = 'yellow';

    constructor(x: number, y: number, direction: { x: number, y: number }, speed: number, damage: number, isMagic: boolean = false, spriteSrc?: string) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.damage = damage;
        this.isMagic = isMagic;

        if (this.isMagic) {
            this.color = '#00FFFF'; // Cyan for magic
        }

        if (spriteSrc) {
            this.sprite = new Sprite(spriteSrc);
        }
    }

    public update(dt: number, tilemap: Tilemap) {
        this.x += this.direction.x * this.speed * dt;
        this.y += this.direction.y * this.speed * dt;

        // Wall collision
        if (tilemap.isSolid(this.x + this.width / 2, this.y + this.height / 2)) {
            this.shouldRemove = true;
        }
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera) {
        const screenX = Math.floor(this.x - camera.x);
        const screenY = Math.floor(this.y - camera.y);

        if (this.sprite) {
            this.sprite.draw(ctx, screenX, screenY, 0, 0, this.sprite.width, this.sprite.height, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(screenX, screenY, this.width, this.height);
        }
    }

    public getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
