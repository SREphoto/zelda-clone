import { Particle, ParticleType } from '../Particle';

export class ParticleSprite {
    public draw(ctx: CanvasRenderingContext2D, particle: Particle, camera: { x: number, y: number }) {
        const sx = Math.floor(particle.x - camera.x);
        const sy = Math.floor(particle.y - camera.y);

        // Opacity fade based on life
        const opacity = Math.max(0, particle.life / particle.maxLife);
        ctx.globalAlpha = opacity;

        switch (particle.type) {
            case ParticleType.Explosion:
                this.drawExplosion(ctx, sx, sy, particle.size, particle.life, particle.maxLife);
                break;
            case ParticleType.Poof:
                this.drawPoof(ctx, sx, sy, particle.size);
                break;
            case ParticleType.Spark:
                ctx.fillStyle = particle.color;
                ctx.fillRect(sx, sy, particle.size, particle.size);
                break;
            default:
                ctx.fillStyle = particle.color;
                ctx.fillRect(sx, sy, particle.size, particle.size);
                break;
        }

        ctx.globalAlpha = 1.0; // Reset
    }

    private drawExplosion(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, life: number, maxLife: number) {
        // Multi-stage explosion
        const lifeRatio = life / maxLife;

        ctx.beginPath();
        ctx.arc(x, y, size * (1 - lifeRatio + 0.5), 0, Math.PI * 2);

        if (lifeRatio > 0.7) ctx.fillStyle = '#FFFFFF'; // White flash
        else if (lifeRatio > 0.4) ctx.fillStyle = '#FFFF00'; // Yellow
        else ctx.fillStyle = '#FF4500'; // Red/Orange fade

        ctx.fill();

        // Smoke particles (simple circles around)
        if (lifeRatio < 0.5) {
            ctx.fillStyle = '#808080';
            ctx.beginPath();
            ctx.arc(x - 10, y - 10, 8, 0, Math.PI * 2);
            ctx.arc(x + 12, y - 8, 6, 0, Math.PI * 2);
            ctx.arc(x - 5, y + 12, 7, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    private drawPoof(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
        // Classic Zelda death "cloud" (spiraling or expanding)
        // Approximating with a cross shape capable of spinning/expanding

        ctx.fillStyle = '#FF0000'; // Or specific death color
        const half = size / 2;

        ctx.fillRect(x - half, y - 2, size, 4);
        ctx.fillRect(x - 2, y - half, 4, size);

        // Inner
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(x - half / 2, y - 1, size / 2, 2);
        ctx.fillRect(x - 1, y - half / 2, 2, size / 2);
    }
}
