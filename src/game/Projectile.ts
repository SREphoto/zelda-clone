import { ProjectileSprite } from './sprites/ProjectileSprite';
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

    private sprite: ProjectileSprite | null = null;

    constructor(x: number, y: number, direction: { x: number, y: number }, speed: number, damage: number, isMagic: boolean = false) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.damage = damage;
        this.isMagic = isMagic;

        this.sprite = new ProjectileSprite();
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
        if (this.sprite) {
            this.sprite.draw(
                ctx,
                0, 0, 0, 0,
                this.width,
                this.height,
                this,
                { x: camera.x, y: camera.y }
            );
        }
    }

    public getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
