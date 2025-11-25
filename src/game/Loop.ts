export class Loop {
  private lastTime: number = 0;
  private running: boolean = false;
  private animationFrameId: number = 0;
  private update: (dt: number) => void;
  private render: () => void;

  constructor(update: (dt: number) => void, render: () => void) {
    this.update = update;
    this.render = render;
  }

  public start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    this.running = false;
    cancelAnimationFrame(this.animationFrameId);
  }

  private loop = (timestamp: number) => {
    if (!this.running) return;

    const dt = (timestamp - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
