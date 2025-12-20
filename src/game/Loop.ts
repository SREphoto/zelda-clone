export class Loop {
  private lastTime: number = 0;
  private running: boolean = false;
  private animationFrameId: number = 0;
  private update: (dt: number) => void;
  private render: () => void;
  private frameCount: number = 0;

  constructor(update: (dt: number) => void, render: () => void) {
    this.update = update;
    this.render = render;
  }

  public start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    console.log('🎮 Game Loop STARTED');
    this.loop(this.lastTime);
  }

  public stop() {
    this.running = false;
    cancelAnimationFrame(this.animationFrameId);
    console.log('🛑 Game Loop STOPPED');
  }

  private loop = (timestamp: number) => {
    if (!this.running) return;

    const dt = (timestamp - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    // Log every 60 frames (once per second at 60fps)
    this.frameCount++;
    if (this.frameCount % 60 === 0) {
      console.log(`🔄 Game loop running - Frame ${this.frameCount}, dt: ${dt.toFixed(3)}s`);
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
