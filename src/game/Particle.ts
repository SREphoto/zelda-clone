export const ParticleType = {
    Explosion: 0, // Bomb explosion
    Poof: 1,      // Enemy death
    Spark: 2,     // Sword hit / Shield deflect
    Debris: 3     // Rock shattering
} as const;

export type ParticleType = typeof ParticleType[keyof typeof ParticleType];

export class Particle {
    public x: number;
    public y: number;
    public type: ParticleType;
    public life: number; // Time in seconds
    public maxLife: number;
    public velocity: { x: number, y: number };
    public size: number;
    public color: string;

    constructor(x: number, y: number, type: ParticleType) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.velocity = { x: 0, y: 0 };
        this.size = 8;
        this.color = '#FFFFFF';

        switch (type) {
            case ParticleType.Explosion:
                this.life = 0.5;
                this.size = 24;
                this.color = '#FF4500'; // OrangeRed
                break;
            case ParticleType.Poof:
                this.life = 0.4;
                this.size = 16;
                this.color = '#FF69B4'; // HotPink / Reddish for enemy death
                break;
            case ParticleType.Spark:
                this.life = 0.2;
                this.size = 4;
                this.color = '#FFFF00'; // Yellow
                this.velocity = {
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100
                };
                break;
            default:
                this.life = 0.5;
                break;
        }

        this.maxLife = this.life;
    }

    public update(dt: number) {
        this.life -= dt;
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
    }

    public isDead(): boolean {
        return this.life <= 0;
    }
}
