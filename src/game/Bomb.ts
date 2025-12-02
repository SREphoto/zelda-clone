import { Camera } from './Camera';
import { BombSprite } from './sprites/BombSprite';

export const BombState = {
    Fuse: 0,
    Exploding: 1,
    Done: 2
} as const;
export type BombState = typeof BombState[keyof typeof BombState];

export class Bomb {
    public x: number;
    public y: number;
    public width: number = 16;
    public height: number = 16;
    public state: BombState = BombState.Fuse;
    public damage: number = 4; // Bombs deal heavy damage

    private timer: number = 0;
    private static FUSE_TIME = 1.5;
    private static EXPLOSION_TIME = 0.5;
    private sprite: BombSprite;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.sprite = new BombSprite();
    }

    public update(dt: number) {
        this.timer += dt;

        if (this.state === BombState.Fuse) {
            if (this.timer >= Bomb.FUSE_TIME) {
                this.state = BombState.Exploding;
                this.timer = 0;
                // Expand hitbox for explosion
                this.x -= 16;
                this.y -= 16;
                this.width = 48;
                this.height = 48;
            }
        } else if (this.state === BombState.Exploding) {
            if (this.timer >= Bomb.EXPLOSION_TIME) {
                this.state = BombState.Done;
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera) {
        this.sprite.draw(
            ctx,
            0, 0, 0, 0,
            this.width,
            this.height,
            this,
            { x: camera.x, y: camera.y }
        );
    }

    public getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
