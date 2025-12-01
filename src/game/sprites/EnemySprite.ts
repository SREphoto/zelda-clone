import { Enemy, EnemyType, EnemyState } from '../Enemy';

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
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
            return;
        }

        switch (enemy.type) {
            case EnemyType.OctorokRed:
            case EnemyType.OctorokBlue:
                this.drawOctorok(ctx, width, height, enemy.type === EnemyType.OctorokRed ? '#FF0000' : '#0000FF', enemy.direction);
                break;
            case EnemyType.TektiteRed:
            case EnemyType.TektiteBlue:
                this.drawTektite(ctx, width, height, enemy.type === EnemyType.TektiteRed ? '#FF0000' : '#0000FF', enemy.jumpTimer > 0);
                break;
            case EnemyType.MoblinRed:
            case EnemyType.MoblinBlue:
                this.drawMoblin(ctx, width, height, enemy.type === EnemyType.MoblinRed ? '#FF0000' : '#0000FF', enemy.direction);
                break;
            case EnemyType.LeeverRed:
            case EnemyType.LeeverBlue:
                this.drawLeever(ctx, width, height, enemy.type === EnemyType.LeeverRed ? '#FF0000' : '#0000FF', enemy.state);
                break;
            case EnemyType.LynelRed:
            case EnemyType.LynelBlue:
                this.drawLynel(ctx, width, height, enemy.type === EnemyType.LynelRed ? '#FF0000' : '#0000FF', enemy.direction);
                break;
            case EnemyType.DarknutRed:
            case EnemyType.DarknutBlue:
                this.drawDarknut(ctx, width, height, enemy.type === EnemyType.DarknutRed ? '#FF0000' : '#0000FF', enemy.direction);
                break;
            case EnemyType.Keese:
                this.drawKeese(ctx, width, height);
                break;
            case EnemyType.Zol:
            case EnemyType.Gel:
                this.drawSlime(ctx, width, height, enemy.type === EnemyType.Zol);
                break;
            case EnemyType.Stalfos:
                this.drawStalfos(ctx, width, height);
                break;
            case EnemyType.GoriyaRed:
            case EnemyType.GoriyaBlue:
                this.drawGoriya(ctx, width, height, enemy.type === EnemyType.GoriyaRed ? '#FF0000' : '#0000FF', enemy.direction);
                break;
            case EnemyType.Wallmaster:
                this.drawWallmaster(ctx, width, height);
                break;
            case EnemyType.Rope:
                this.drawRope(ctx, width, height, enemy.direction);
                break;
            case EnemyType.PolsVoice:
                this.drawPolsVoice(ctx, width, height);
                break;
            case EnemyType.LikeLike:
                this.drawLikeLike(ctx, width, height);
                break;
            case EnemyType.Gibdo:
                this.drawGibdo(ctx, width, height);
                break;
            case EnemyType.Moldorm:
                this.drawMoldorm(ctx, width, height);
                break;
            case EnemyType.Vire:
                this.drawVire(ctx, width, height);
                break;
            case EnemyType.Bubble:
                this.drawBubble(ctx, width, height);
                break;
            case EnemyType.Peahat:
                this.drawPeahat(ctx, width, height, enemy.state === EnemyState.Flying);
                break;
            case EnemyType.Zola:
                this.drawZola(ctx, width, height, enemy.state);
                break;
            case EnemyType.Ghini:
                this.drawGhini(ctx, width, height);
                break;
            case EnemyType.Armos:
                this.drawArmos(ctx, width, height, enemy.state === EnemyState.Moving);
                break;
            // Bosses
            case EnemyType.Aquamentus:
                this.drawAquamentus(ctx, width, height);
                break;
            case EnemyType.Dodongo:
                this.drawDodongo(ctx, width, height);
                break;
            case EnemyType.Manhandla:
                this.drawManhandla(ctx, width, height);
                break;
            case EnemyType.Gleeok:
                this.drawGleeok(ctx, width, height);
                break;
            case EnemyType.Digdogger:
                this.drawDigdogger(ctx, width, height);
                break;
            case EnemyType.Gohma:
                this.drawGohma(ctx, width, height, enemy.state === EnemyState.EyeOpen);
                break;
            case EnemyType.Ganon:
                this.drawGanon(ctx, width, height, enemy.state === EnemyState.Invisible);
                break;
            default:
                // Fallback
                ctx.fillStyle = '#FF00FF';
                ctx.fillRect(0, 0, width, height);
        }

        ctx.restore();
    }

    private drawOctorok(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, dir: { x: number, y: number }) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#FFFFFF';
        if (dir.y > 0) ctx.fillRect(w / 2 - 2, h - 6, 4, 6); // Down
        else if (dir.y < 0) ctx.fillRect(w / 2 - 2, 0, 4, 6); // Up
        else if (dir.x < 0) ctx.fillRect(0, h / 2 - 2, 6, 4); // Left
        else ctx.fillRect(w - 6, h / 2 - 2, 6, 4); // Right

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(w / 2 - 5, h / 2 - 5, 3, 3);
        ctx.fillRect(w / 2 + 2, h / 2 - 5, 3, 3);
    }

    private drawTektite(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, jumping: boolean) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 - 2, w / 3, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.fillRect(w / 2 - 1, h / 2 - 3, 2, 2);

        // Legs
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (jumping) {
            ctx.moveTo(w / 2 - 4, h / 2); ctx.lineTo(w / 2 - 8, h);
            ctx.moveTo(w / 2 + 4, h / 2); ctx.lineTo(w / 2 + 8, h);
        } else {
            ctx.moveTo(w / 2 - 4, h / 2); ctx.lineTo(0, h);
            ctx.moveTo(w / 2 + 4, h / 2); ctx.lineTo(w, h);
        }
        ctx.stroke();
    }

    private drawMoblin(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, dir: { x: number, y: number }) {
        // Body
        ctx.fillStyle = color; // Skin
        ctx.fillRect(4, 4, w - 8, h - 4);

        // Tunic
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(6, 12, w - 12, h - 12);

        // Face
        ctx.fillStyle = '#000000';
        if (dir.y > 0) { // Front
            ctx.fillRect(8, 8, 2, 2); ctx.fillRect(w - 10, 8, 2, 2); // Eyes
            ctx.fillRect(w / 2 - 2, 12, 4, 2); // Mouth
        } else if (dir.x !== 0) { // Side
            const offset = dir.x > 0 ? 4 : 0;
            ctx.fillRect(8 + offset, 8, 2, 2); // Eye
            ctx.fillStyle = color;
            ctx.fillRect(dir.x > 0 ? w - 4 : 0, 10, 4, 4); // Snout
        }
    }

    private drawLeever(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, state: number) {
        if (state === EnemyState.Idle) return; // Buried

        ctx.fillStyle = color;
        // Conical shape
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Spikes (spinning)
        ctx.fillStyle = '#FFFFFF';
        const offset = (Date.now() / 100) % 4;
        ctx.fillRect(offset, h / 2, 4, 4);
        ctx.fillRect(w - offset - 4, h / 2 + 4, 4, 4);
    }

    private drawLynel(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, dir: { x: number, y: number }) {
        // Centaur body
        ctx.fillStyle = color;
        ctx.fillRect(4, 8, w - 8, h - 8);

        // Head (Lion)
        ctx.fillStyle = '#FFFFFF'; // Mane
        ctx.fillRect(6, 0, w - 12, 10);
        ctx.fillStyle = color; // Face
        ctx.fillRect(8, 2, w - 16, 6);

        // Weapon
        ctx.fillStyle = '#C0C0C0';
        if (dir.x < 0) ctx.fillRect(0, 12, 4, 12); // Sword Left
        else ctx.fillRect(w - 4, 12, 4, 12); // Sword Right
    }

    private drawDarknut(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, dir: { x: number, y: number }) {
        // Armor
        ctx.fillStyle = color;
        ctx.fillRect(4, 2, w - 8, h - 2);

        // Shield
        ctx.fillStyle = '#C0C0C0';
        if (dir.y > 0) ctx.fillRect(4, 10, w - 8, 10); // Front Shield
        else if (dir.x < 0) ctx.fillRect(0, 6, 6, h - 10); // Left Shield
        else if (dir.x > 0) ctx.fillRect(w - 6, 6, 6, h - 10); // Right Shield
    }

    private drawKeese(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#000000';
        // Bat wings
        const flap = Math.floor(Date.now() / 100) % 2;
        if (flap) {
            ctx.beginPath();
            ctx.moveTo(w / 2, h / 2); ctx.lineTo(0, 0); ctx.lineTo(w / 2, h); ctx.lineTo(w, 0); ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(w / 2, h / 2); ctx.lineTo(0, h / 2); ctx.lineTo(w / 2, h); ctx.lineTo(w, h / 2); ctx.closePath();
            ctx.fill();
        }
    }

    private drawSlime(ctx: CanvasRenderingContext2D, w: number, h: number, isBig: boolean) {
        ctx.fillStyle = isBig ? '#808080' : '#008080'; // Grey (Zol) or Teal (Gel)

        // Blob shape
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, w / 2, h / 2 - (Math.sin(Date.now() / 100) * 2), 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(w / 2 - 4, h / 2 - 2, 2, 2);
        ctx.fillRect(w / 2 + 2, h / 2 - 2, 2, 2);
    }

    private drawStalfos(ctx: CanvasRenderingContext2D, w: number, _h: number) {
        ctx.fillStyle = '#FFFFFF';
        // Skull
        ctx.fillRect(6, 2, w - 12, 10);
        // Ribs
        ctx.fillRect(8, 14, w - 16, 8);
        // Legs
        ctx.fillRect(8, 24, 2, 8);
        ctx.fillRect(w - 10, 24, 2, 8);

        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(8, 4, 2, 2);
        ctx.fillRect(w - 10, 4, 2, 2);
    }

    private drawGoriya(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, _dir: { x: number, y: number }) {
        ctx.fillStyle = color;
        ctx.fillRect(4, 4, w - 8, h - 4);
        // Ears
        ctx.fillRect(2, 2, 2, 4);
        ctx.fillRect(w - 4, 2, 2, 4);
        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(8, 8, 2, 2);
        ctx.fillRect(w - 10, 8, 2, 2);
    }

    private drawWallmaster(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#FF4500'; // Orange-Red
        // Hand shape
        ctx.fillRect(4, 10, w - 8, h - 10); // Palm
        ctx.fillRect(2, 0, 4, 10); // Finger 1
        ctx.fillRect(8, 0, 4, 10); // Finger 2
        ctx.fillRect(14, 0, 4, 10); // Finger 3
        ctx.fillRect(20, 0, 4, 10); // Finger 4
    }

    private drawRope(ctx: CanvasRenderingContext2D, w: number, h: number, dir: { x: number, y: number }) {
        ctx.fillStyle = '#8B4513'; // Brown
        if (dir.x !== 0) {
            // Horizontal
            ctx.fillRect(0, h / 2 - 4, w, 8);
            ctx.fillStyle = '#00FF00'; // Eyes
            const headX = dir.x > 0 ? w - 4 : 0;
            ctx.fillRect(headX, h / 2 - 2, 4, 4);
        } else {
            // Vertical
            ctx.fillRect(w / 2 - 4, 0, 8, h);
            ctx.fillStyle = '#00FF00'; // Eyes
            const headY = dir.y > 0 ? h - 4 : 0;
            ctx.fillRect(w / 2 - 2, headY, 4, 4);
        }
    }

    private drawPolsVoice(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#FFDAB9'; // Peach
        ctx.fillRect(4, 8, w - 8, h - 8); // Body
        ctx.fillRect(2, 0, 4, 10); // Ear L
        ctx.fillRect(w - 6, 0, 4, 10); // Ear R
        // Whiskers
        ctx.fillStyle = '#000000';
        ctx.fillRect(4, 16, 4, 1);
        ctx.fillRect(w - 8, 16, 4, 1);
    }

    private drawLikeLike(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#FFA500'; // Orange
        // Tube
        ctx.fillRect(4, 4, w - 8, h - 8);
        // Pulsing
        const pulse = Math.sin(Date.now() / 200) * 2;
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(6 - pulse, 6 - pulse, w - 12 + pulse * 2, h - 12 + pulse * 2);
    }

    private drawGibdo(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#F0E68C'; // Khaki (Bandages)
        ctx.fillRect(6, 2, w - 12, h - 2);
        // Bandage lines
        ctx.fillStyle = '#BDB76B';
        for (let i = 6; i < h; i += 4) ctx.fillRect(6, i, w - 12, 1);
    }

    private drawMoldorm(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#FF4500';
        // Segments
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 4, 0, Math.PI * 2);
        ctx.fill();
    }

    private drawVire(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#000080'; // Navy
        ctx.fillRect(4, 8, w - 8, h - 8);
        // Wings
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.moveTo(0, 4); ctx.lineTo(8, 12); ctx.lineTo(0, 16);
        ctx.moveTo(w, 4); ctx.lineTo(w - 8, 12); ctx.lineTo(w, 16);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(8, 10, 2, 2);
        ctx.fillRect(w - 10, 10, 2, 2);
    }

    private drawBubble(ctx: CanvasRenderingContext2D, w: number, h: number) {
        // Flashing
        const color = ['#FF0000', '#0000FF', '#00FF00'][Math.floor(Date.now() / 100) % 3];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
        ctx.fill();
        // Skull
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(w / 2 - 4, h / 2 - 4, 8, 8);
        ctx.fillStyle = '#000000';
        ctx.fillRect(w / 2 - 2, h / 2 - 2, 1, 1);
        ctx.fillRect(w / 2 + 1, h / 2 - 2, 1, 1);
    }

    private drawPeahat(ctx: CanvasRenderingContext2D, w: number, h: number, flying: boolean) {
        ctx.fillStyle = '#FFFF00'; // Yellow bulb
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 4, 6, 0, Math.PI * 2);
        ctx.fill();

        // Propeller
        ctx.fillStyle = '#008000'; // Green
        const angle = flying ? Date.now() / 50 : 0;
        ctx.save();
        ctx.translate(w / 2, h / 2 - 4);
        ctx.rotate(angle);
        ctx.fillRect(-10, -2, 20, 4);
        ctx.fillRect(-2, -10, 4, 20);
        ctx.restore();
    }

    private drawZola(ctx: CanvasRenderingContext2D, w: number, h: number, state: number) {
        if (state === EnemyState.Idle) {
            // Ripples
            ctx.strokeStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, (Date.now() / 50) % 8, 0, Math.PI * 2);
            ctx.stroke();
            return;
        }
        ctx.fillStyle = '#008080'; // Teal
        ctx.fillRect(6, 6, w - 12, h - 6);
        // Fins
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(4, 10); ctx.lineTo(0, 6); ctx.lineTo(4, 14);
        ctx.moveTo(w - 4, 10); ctx.lineTo(w, 6); ctx.lineTo(w - 4, 14);
        ctx.fill();
    }

    private drawGhini(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 - 4, 8, 0, Math.PI * 2); // Head
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w / 2 - 8, h / 2);
        ctx.lineTo(w / 2, h);
        ctx.lineTo(w / 2 + 8, h / 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 - 4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF0000'; // Pupil
        ctx.fillRect(w / 2 - 1, h / 2 - 5, 2, 2);
    }

    private drawArmos(ctx: CanvasRenderingContext2D, w: number, h: number, active: boolean) {
        ctx.fillStyle = active ? '#FF4500' : '#8B4513'; // Red if active, Brown if statue
        ctx.fillRect(4, 4, w - 8, h - 4);
        // Shield/Details
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 2, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // --- Bosses ---
    private drawAquamentus(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#00FF00'; // Green Dragon
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#FFFFFF'; // Horn
        ctx.fillRect(w - 8, 0, 4, 8);
        ctx.fillStyle = '#000000'; // Eye
        ctx.fillRect(w - 8, 8, 4, 4);
    }

    private drawDodongo(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#ADFF2F'; // Green-Yellow
        ctx.fillRect(0, 8, w, h - 8); // Body
        ctx.fillStyle = '#006400'; // Back
        ctx.fillRect(4, 8, w - 8, 4);
        ctx.fillStyle = '#FFFFFF'; // Horns
        ctx.fillRect(w - 4, 4, 4, 4);
    }

    private drawManhandla(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#006400'; // Core
        ctx.fillRect(w / 2 - 8, h / 2 - 8, 16, 16);
        // Limbs
        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(w / 2 - 4, 0, 8, 8); // Top
        ctx.fillRect(w / 2 - 4, h - 8, 8, 8); // Bottom
        ctx.fillRect(0, h / 2 - 4, 8, 8); // Left
        ctx.fillRect(w - 8, h / 2 - 4, 8, 8); // Right
    }

    private drawGleeok(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#006400'; // Body
        ctx.fillRect(8, 16, w - 16, h - 16);
        // Heads
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(0, 0, 12, 12);
        ctx.fillRect(w - 12, 0, 12, 12);
    }

    private drawDigdogger(ctx: CanvasRenderingContext2D, w: number, h: number) {
        ctx.fillStyle = '#FF8C00'; // Orange
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
        ctx.fill();
        // Eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(w / 2 - 2, h / 2 - 2, 4, 4);
    }

    private drawGohma(ctx: CanvasRenderingContext2D, w: number, h: number, eyeOpen: boolean) {
        ctx.fillStyle = '#8B4513'; // Brown Shell
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, w / 2, h / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        if (eyeOpen) {
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#808080'; // Eyelid
            ctx.fillRect(w / 2 - 6, h / 2 - 2, 12, 4);
        }
    }

    private drawGanon(ctx: CanvasRenderingContext2D, w: number, h: number, invisible: boolean) {
        if (invisible) return;
        ctx.fillStyle = '#00008B'; // Dark Blue Pig
        ctx.fillRect(4, 4, w - 8, h - 4);
        ctx.fillStyle = '#FF0000'; // Eyes
        ctx.fillRect(8, 10, 4, 2);
        ctx.fillRect(w - 12, 10, 4, 2);
        // Trident
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(w - 4, 0, 2, h);
    }
}
