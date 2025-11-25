import { Camera } from './Camera';

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

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
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
        const screenX = Math.floor(this.x - camera.x);
        const screenY = Math.floor(this.y - camera.y);

        if (this.state === BombState.Fuse) {
            // Draw Bomb (Blue Circle for now)
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(screenX + 8, screenY + 8, 6, 0, Math.PI * 2);
            ctx.fill();

            // Fuse flicker
            if (Math.floor(this.timer * 10) % 2 === 0) {
                ctx.fillStyle = 'white';
                ctx.fillRect(screenX + 8, screenY, 2, 4);
            }
        } else if (this.state === BombState.Exploding) {
            // Draw Explosion (Red/Orange flicker)
            ctx.fillStyle = Math.floor(this.timer * 20) % 2 === 0 ? 'red' : 'orange';
            ctx.fillRect(screenX, screenY, this.width, this.height);
        }
    }

    public getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
