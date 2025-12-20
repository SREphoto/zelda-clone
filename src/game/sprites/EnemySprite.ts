import { Enemy, EnemyType, EnemyState } from '../Enemy';
import { resources } from '../ResourceManager';

export class EnemySprite {
    constructor() {
    }

    public draw(
        ctx: CanvasRenderingContext2D,
        _frameX: number,
        _frameY: number,
        _frameWidth: number,
        _frameHeight: number,
        width: number,
        height: number,
        enemy: Enemy,
        camera: { x: number; y: number }
    ) {
        const sx = Math.floor(enemy.x - camera.x);
        const sy = Math.floor(enemy.y - camera.y);

        ctx.save();
        ctx.translate(sx, sy);

        // Shadow
        if (enemy.z > 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(width / 2, height + enemy.z - 2, 6, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Flashing effect (damage/stun)
        if (enemy.invulnerabilityTimer > 0 && Math.floor(Date.now() / 50) % 2 === 0) {
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = '#FFFFFF';
            // Placeholder rect for flash if no sprite drawn yet, but we will draw sprite then composite
        }

        const enemiesImg = resources.getImage('/assets/enemies.png');
        const bossesImg = resources.getImage('/assets/bosses.png');

        if (enemiesImg && !this.isBoss(enemy.type)) {
            // Basic Enemies
            let tx = 0, ty = 0;
            const anim = Math.floor(Date.now() / 200) % 2;

            switch (enemy.type) {
                case EnemyType.OctorokRed: tx = 0; ty = 0; break;
                case EnemyType.OctorokBlue: tx = 2; ty = 0; break;
                case EnemyType.TektiteRed: tx = 4; ty = 0; break;
                case EnemyType.TektiteBlue: tx = 6; ty = 0; break;
                case EnemyType.MoblinRed: tx = 0; ty = 2; break;
                case EnemyType.MoblinBlue: tx = 2; ty = 2; break;
                case EnemyType.LeeverRed: tx = 4; ty = 2; break;
                case EnemyType.LeeverBlue: tx = 6; ty = 2; break;
                case EnemyType.LynelRed: tx = 0; ty = 4; break;
                case EnemyType.LynelBlue: tx = 2; ty = 4; break;
                case EnemyType.DarknutRed: tx = 4; ty = 4; break;
                case EnemyType.DarknutBlue: tx = 6; ty = 4; break;
                case EnemyType.Keese: tx = 0; ty = 6; break;
                case EnemyType.Zol: tx = 2; ty = 6; break;
                case EnemyType.Stalfos: tx = 4; ty = 6; break;
                case EnemyType.GoriyaRed: tx = 6; ty = 6; break;
                default: tx = 0; ty = 0; break;
            }

            // Draw Sprite
            // Assuming 128x128 per sprite in 8x8 grid on 1024 sheet
            // Animation frames assumed to be next to each other
            const srcSize = 128;
            ctx.drawImage(enemiesImg, (tx + anim) * srcSize, ty * srcSize, srcSize, srcSize, 0, 0, width, height);

        } else if (bossesImg && this.isBoss(enemy.type)) {
            // Boss Sprites
            // Placeholder for boss mapping
            ctx.drawImage(bossesImg, 0, 0, 32, 32, 0, 0, width, height);
        } else {
            // Fallback
            if (this.isBoss(enemy.type)) {
                this.drawBossProcedural(ctx, width, height, enemy);
            } else {
                ctx.fillStyle = 'red';
                ctx.fillRect(0, 0, width, height);
            }
        }

        ctx.restore();
    }

    private isBoss(type: EnemyType): boolean {
        return type >= EnemyType.Aquamentus; // Assuming enum order, checking explicitly is safer
    }

    private drawBossProcedural(ctx: CanvasRenderingContext2D, width: number, height: number, enemy: Enemy) {
        switch (enemy.type) {
            case EnemyType.Aquamentus: this.drawAquamentus(ctx, width, height); break;
            case EnemyType.Dodongo: this.drawDodongo(ctx, width, height); break;
            // ... Call existing private methods
            case EnemyType.Manhandla: this.drawManhandla(ctx, width, height); break;
            case EnemyType.Gleeok: this.drawGleeok(ctx, width, height); break;
            case EnemyType.Digdogger: this.drawDigdogger(ctx, width, height); break;
            case EnemyType.Gohma: this.drawGohma(ctx, width, height, enemy.state === EnemyState.EyeOpen); break;
            case EnemyType.Ganon: this.drawGanon(ctx, width, height, enemy.state === EnemyState.Invisible); break;
        }
    }




    // --- Bosses ---
    private drawAquamentus(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Green Dragon Body
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2 + 4, w / 2 - 4, h / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Neck & Head
        ctx.beginPath();
        ctx.moveTo(w / 2 + 8, h / 2);
        ctx.quadraticCurveTo(w / 2 + 12, h / 2 - 16, w / 2 + 4, h / 2 - 20);
        ctx.lineTo(w / 2 - 4, h / 2 - 20);
        ctx.quadraticCurveTo(w / 2 - 12, h / 2 - 16, w / 2 - 8, h / 2);
        ctx.fill();

        // Wings
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.moveTo(w / 2 + 4, h / 2 - 4);
        ctx.lineTo(w, h / 2 - 16);
        ctx.lineTo(w / 2 + 12, h / 2 + 4);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w / 2 - 4, h / 2 - 4);
        ctx.lineTo(0, h / 2 - 16);
        ctx.lineTo(w / 2 - 12, h / 2 + 4);
        ctx.fill();

        // Horn
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2 - 20);
        ctx.lineTo(w / 2 + 4, h / 2 - 28);
        ctx.lineTo(w / 2 - 4, h / 2 - 28);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000000';
        ctx.fillRect(w / 2 + 2, h / 2 - 18, 2, 2);
    }

    private drawDodongo(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Triceratops-like Body
        ctx.fillStyle = '#9ACD32';
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, w / 2, h / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(w - 8, h / 2, 10, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillRect(8, h / 2 + 4, 6, 12);
        ctx.fillRect(w - 14, h / 2 + 4, 6, 12);

        // Back plates
        ctx.fillStyle = '#556B2F';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(w / 4 + i * 16, h / 2 - 8);
            ctx.lineTo(w / 4 + i * 16 + 8, h / 2 - 16);
            ctx.lineTo(w / 4 + i * 16 + 16, h / 2 - 8);
            ctx.fill();
        }

        // Eye
        ctx.fillStyle = '#000000';
        ctx.fillRect(w - 6, h / 2 - 4, 2, 2);
    }

    private drawManhandla(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Core
        ctx.fillStyle = '#556B2F';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 10, 0, Math.PI * 2);
        ctx.fill();

        // Mouths (Limbs) - 4 Directions
        ctx.fillStyle = '#FF4500';
        // Top
        this.drawManhandlaMouth(ctx, w / 2 - 6, 0, 12, 12);
        // Bottom
        this.drawManhandlaMouth(ctx, w / 2 - 6, h - 12, 12, 12);
        // Left
        this.drawManhandlaMouth(ctx, 0, h / 2 - 6, 12, 12);
        // Right
        this.drawManhandlaMouth(ctx, w - 12, h / 2 - 6, 12, 12);
    }

    private drawManhandlaMouth(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        ctx.fillStyle = '#006400'; // Stalk
        ctx.fillRect(x + w / 2 - 2, y + h / 2 - 2, 4, 4);

        ctx.fillStyle = '#FF4500'; // Mouth
        const bite = (Math.floor(Date.now() / 200) % 2 === 0);
        if (bite) {
            ctx.fillRect(x, y, w, h); // Closed
        } else {
            ctx.beginPath();
            ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI, true); // Open
            ctx.fill();
        }
    }

    private drawGleeok(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Body
        ctx.fillStyle = '#006400';
        ctx.beginPath();
        ctx.ellipse(w / 2, h - 10, w / 3, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Necks & Heads (2 Heads)
        this.drawGleeokHead(ctx, w / 2 - 4, h - 10, w / 4, h / 3);
        this.drawGleeokHead(ctx, w / 2 + 4, h - 10, 3 * w / 4, h / 3);
    }

    private drawGleeokHead(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) {
        ctx.strokeStyle = '#32CD32';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(startX, (startY + endY) / 2, endX, endY);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(endX - 6, endY - 6, 12, 12);
        // Eye
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(endX - 2, endY - 2, 4, 4);
        ctx.fillStyle = '#000000';
        ctx.fillRect(endX, endY, 2, 2);
    }

    private drawDigdogger(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Sea Urchin / Blob
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        const pulse = Math.sin(Date.now() / 200) * 2;
        ctx.arc(w / 2, h / 2, w / 2 - 4 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Eye (Large)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 4, 0, Math.PI * 2);
        ctx.fill();

        // Spikes/Texture
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(w / 2 + Math.cos(angle) * 10, h / 2 + Math.sin(angle) * 10);
            ctx.lineTo(w / 2 + Math.cos(angle) * 20, h / 2 + Math.sin(angle) * 20);
            ctx.stroke();
        }
    }

    private drawGohma(ctx: CanvasRenderingContext2D, w: number, h: number, eyeOpen: boolean) {
        // Legs
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        // Left Legs
        ctx.beginPath(); ctx.moveTo(w / 2 - 8, h / 2); ctx.lineTo(0, h / 2 - 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w / 2 - 8, h / 2 + 4); ctx.lineTo(0, h / 2 + 10); ctx.stroke();
        // Right Legs
        ctx.beginPath(); ctx.moveTo(w / 2 + 8, h / 2); ctx.lineTo(w, h / 2 - 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w / 2 + 8, h / 2 + 4); ctx.lineTo(w, h / 2 + 10); ctx.stroke();

        // Shell
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, w / 3, h / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        if (eyeOpen) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FF0000'; // Pupil
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#8B4513'; // Eyelid
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, 6, 0, Math.PI * 2);
            ctx.fill();
            // Slit
            ctx.fillStyle = '#000000';
            ctx.fillRect(w / 2 - 6, h / 2 - 1, 12, 2);
        }
    }

    private drawGanon(ctx: CanvasRenderingContext2D, w: number, h: number, invisible: boolean) {
        if (invisible) return;

        // Cloak / Body
        ctx.fillStyle = '#191970'; // Midnight Blue
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Pig Face
        ctx.fillStyle = '#0000CD'; // Medium Blue
        ctx.fillRect(w / 2 - 6, 8, 12, 10);

        // Eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(w / 2 - 4, 10, 2, 2);
        ctx.fillRect(w / 2 + 2, 10, 2, 2);

        // Tusks
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(w / 2 - 6, 14); ctx.lineTo(w / 2 - 8, 10); ctx.lineTo(w / 2 - 4, 14);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w / 2 + 6, 14); ctx.lineTo(w / 2 + 8, 10); ctx.lineTo(w / 2 + 4, 14);
        ctx.fill();

        // Skull Necklace
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(w / 2, 20, 3, 0, Math.PI * 2);
        ctx.fill();

        // Trident
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(w - 6, 0, 2, h);
        ctx.fillRect(w - 10, 0, 10, 2); // Prongs base
        ctx.fillRect(w - 10, -4, 2, 4);
        ctx.fillRect(w - 6, -6, 2, 6);
        ctx.fillRect(w - 2, -4, 2, 4);
    }
}

