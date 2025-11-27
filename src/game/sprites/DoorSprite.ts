import { Sprite } from '../Sprite';
import { Door } from '../Door';

export class DoorSprite extends Sprite {
    constructor() {
        super('/sprites/dungeon.png');
    }

    public draw(
        ctx: CanvasRenderingContext2D,
        _frameX: number,
        _frameY: number,
        _frameWidth: number,
        _frameHeight: number,
        width: number,
        height: number,
        door: Door,
        camera: { x: number, y: number }
    ) {
        // Simple placeholder logic for drawing a door
        // In a real implementation, you'd calculate source coordinates based on door state
        const screenX = door.x - camera.x;
        const screenY = door.y - camera.y;

        ctx.fillStyle = door.isLocked ? '#444' : '#8B4513'; // Dark gray if locked, brown if unlocked
        if (door.isOpen) {
            ctx.fillStyle = '#000'; // Open door looks like a black void
        }

        ctx.fillRect(screenX, screenY, width, height);

        // Draw lock if needed
        if (door.isLocked) {
            ctx.fillStyle = 'gold';
            ctx.fillRect(screenX + width / 2 - 4, screenY + height / 2 - 4, 8, 8);
        }
    }
}
