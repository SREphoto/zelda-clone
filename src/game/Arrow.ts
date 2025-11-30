import { Camera } from './Camera';

export class Arrow {
    public x: number;
    public y: number;
    public direction: { x: number, y: number };
    public speed: number = 200; // Fast speed
    public damage: number = 2; // Standard arrow damage
    public active: boolean = true;
    public width: number = 16;
    public height: number = 4; // Horizontal arrow height
    public isSilver: boolean = false;

    constructor(x: number, y: number, direction: { x: number, y: number }, isSilver: boolean = false) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.isSilver = isSilver;

        if (this.isSilver) {
            this.damage = 4; // Higher damage
        }

        // Adjust dimensions based on direction
        if (this.direction.y !== 0) {
            this.width = 4;
            this.height = 16;
        }
    }

    public get rotation(): number {
        if (this.direction.x > 0) return 0;
        if (this.direction.x < 0) return Math.PI;
        if (this.direction.y > 0) return Math.PI / 2;
        if (this.direction.y < 0) return -Math.PI / 2;
        return 0;
    }

    public update(dt: number) {
        this.x += this.direction.x * this.speed * dt;
        this.y += this.direction.y * this.speed * dt;

        // Deactivate if out of bounds (simple check, can be improved with camera/map bounds)
        // For now, let Game.ts handle bounds or just let it fly for a bit
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera) {
        const screenX = Math.floor(this.x - camera.x);
        const screenY = Math.floor(this.y - camera.y);

        ctx.fillStyle = this.isSilver ? '#C0C0C0' : '#FFFF00'; // Silver or Yellow
        ctx.fillRect(screenX, screenY, this.width, this.height);

        // Add a "head" to the arrow
        ctx.fillStyle = '#FFFFFF';
        if (this.direction.x > 0) {
            ctx.fillRect(screenX + this.width - 2, screenY, 2, this.height);
        } else if (this.direction.x < 0) {
            ctx.fillRect(screenX, screenY, 2, this.height);
        } else if (this.direction.y > 0) {
            ctx.fillRect(screenX, screenY + this.height - 2, this.width, 2);
        } else if (this.direction.y < 0) {
            ctx.fillRect(screenX, screenY, this.width, 2);
        }
    }

    public getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
