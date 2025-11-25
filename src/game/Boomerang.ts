import { Tilemap } from './Tilemap';
import { Player } from './Player';

export class Boomerang {
    public x: number;
    public y: number;
    public width: number = 8;
    public height: number = 8;
    public direction: { x: number, y: number };
    public speed: number = 200;
    public state: 'outward' | 'returning' = 'outward';
    public distanceTraveled: number = 0;
    public maxDistance: number = 150;
    public shouldRemove: boolean = false;
    public damage: number = 0; // Stuns instead of damage

    constructor(x: number, y: number, direction: { x: number, y: number }) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    public update(dt: number, player: Player) {
        const moveAmt = this.speed * dt;

        if (this.state === 'outward') {
            this.x += this.direction.x * moveAmt;
            this.y += this.direction.y * moveAmt;
            this.distanceTraveled += moveAmt;

            if (this.distanceTraveled >= this.maxDistance) {
                this.state = 'returning';
            }
        } else {
            // Return to player
            const dx = (player.x + player.width / 2) - (this.x + this.width / 2);
            const dy = (player.y + player.height / 2) - (this.y + this.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 10) {
                this.shouldRemove = true;
                return;
            }

            this.x += (dx / dist) * moveAmt;
            this.y += (dy / dist) * moveAmt;
        }
    }

    public render(ctx: CanvasRenderingContext2D, camera: { x: number, y: number }) {
        const screenX = Math.floor(this.x - camera.x);
        const screenY = Math.floor(this.y - camera.y);

        ctx.fillStyle = '#FFD700'; // Gold
        ctx.beginPath();
        ctx.arc(screenX + 4, screenY + 4, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    public getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
