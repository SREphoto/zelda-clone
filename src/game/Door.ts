import { DoorSprite } from './sprites/DoorSprite';
import { SecretWallSprite } from './sprites/SecretWallSprite';

export class Door {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public isLocked: boolean;
    public isOpen: boolean = false;
    public direction: 'up' | 'down' | 'left' | 'right';
    private sprite: DoorSprite;
    private openProgress: number = 0; // 0..1 for opening animation

    constructor(x: number, y: number, direction: 'up' | 'down' | 'left' | 'right', isLocked: boolean = false) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.isLocked = isLocked;
        this.sprite = new DoorSprite();

        // Door dimensions based on direction
        if (direction === 'up' || direction === 'down') {
            this.width = 64;
            this.height = 16;
        } else {
            this.width = 16;
            this.height = 64;
        }
    }

    public unlock() {
        if (this.isLocked) {
            this.isLocked = false;
            this.isOpen = true;
            this.openProgress = 0;
            console.log('Door unlocked!');
        }
    }

    public getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    /** Call each frame to advance opening animation */
    public update(dt: number) {
        if (this.isOpen && this.openProgress < 1) {
            this.openProgress = Math.min(1, this.openProgress + dt * 2); // 0.5s to fully open
        }
    }

    public render(ctx: CanvasRenderingContext2D, camera: { x: number, y: number }) {
        // Use sprite to draw; pass door instance and camera for positioning
        this.sprite.draw(
            ctx,
            0, // frameX (unused)
            0, // frameY (unused)
            0, // frameWidth (unused)
            0, // frameHeight (unused)
            this.width,
            this.height,
            this,
            camera
        );
    }
}

export class SecretWall {
    public x: number;
    public y: number;
    public width: number = 32;
    public height: number = 32;
    public isRevealed: boolean = false;
    public requiresCandle: boolean = false;
    private sprite: SecretWallSprite;

    constructor(x: number, y: number, requiresCandle: boolean = false) {
        this.x = x;
        this.y = y;
        this.requiresCandle = requiresCandle;
        this.sprite = new SecretWallSprite();
    }

    public reveal() {
        this.isRevealed = true;
        console.log('Secret wall revealed!');
    }

    public getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    public render(ctx: CanvasRenderingContext2D, camera: { x: number, y: number }) {
        this.sprite.draw(
            ctx,
            0,
            0,
            0,
            0,
            this.width,
            this.height,
            this,
            camera
        );
    }
}
