export class Animation {
    private frames: number[];
    private speed: number;
    private currentFrameIndex: number = 0;
    private timer: number = 0;

    constructor(frames: number[], speed: number) {
        this.frames = frames;
        this.speed = speed;
    }

    public update(dt: number) {
        this.timer += dt;
        if (this.timer >= this.speed) {
            this.timer = 0;
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
        }
    }

    public getCurrentFrame(): number {
        return this.frames[this.currentFrameIndex];
    }

    public reset() {
        this.currentFrameIndex = 0;
        this.timer = 0;
    }
}
