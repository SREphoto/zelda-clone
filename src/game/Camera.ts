export class Camera {
    public x: number = 0;
    public y: number = 0;
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public follow(targetX: number, targetY: number) {
        // Center the camera on the target
        this.x = targetX - this.width / 2;
        this.y = targetY - this.height / 2;
    }

    public move(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }
}
