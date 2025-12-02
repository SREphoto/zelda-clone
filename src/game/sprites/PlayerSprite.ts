

export class PlayerSprite {
    constructor() {
    }

    public draw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        direction: 'up' | 'down' | 'left' | 'right',
        isAttacking: boolean,
        _swordLevel: number, // 1-4
        shieldLevel: number, // 1=Small, 2=Magical
        defenseRing: number // 0=Green, 1=Blue, 2=Red
    ) {
        // Tunic Color
        let tunicColor = '#00AA00'; // Green
        if (defenseRing === 1) tunicColor = '#4169E1'; // Blue
        if (defenseRing === 2) tunicColor = '#FF0000'; // Red

        // Hat Color (usually same as tunic)
        const hatColor = tunicColor;

        // Skin Color
        const skinColor = '#FFDAB9'; // Peach

        const cx = x + width / 2;
        const cy = y + height / 2;

        ctx.save();
        ctx.translate(cx, cy);

        // Draw based on direction
        switch (direction) {
            case 'down':
                this.drawDown(ctx, width, height, tunicColor, hatColor, skinColor, shieldLevel, isAttacking);
                break;
            case 'up':
                this.drawUp(ctx, width, height, tunicColor, hatColor, skinColor, shieldLevel, isAttacking);
                break;
            case 'left':
                this.drawSide(ctx, width, height, tunicColor, hatColor, skinColor, shieldLevel, isAttacking, true);
                break;
            case 'right':
                this.drawSide(ctx, width, height, tunicColor, hatColor, skinColor, shieldLevel, isAttacking, false);
                break;
        }

        ctx.restore();
    }

    private drawDown(ctx: CanvasRenderingContext2D, _w: number, _h: number, tunic: string, hat: string, skin: string, shield: number, attacking: boolean) {
        // Body
        ctx.fillStyle = tunic;
        ctx.fillRect(-6, -4, 12, 14);

        // Head/Face
        ctx.fillStyle = skin;
        ctx.fillRect(-5, -12, 10, 10);

        // Hat
        ctx.fillStyle = hat;
        ctx.beginPath();
        ctx.moveTo(-6, -12);
        ctx.lineTo(6, -12);
        ctx.lineTo(0, -20); // Pointy hat
        ctx.fill();

        // Shield (Front)
        if (!attacking) {
            this.drawShield(ctx, -8, 2, shield);
        }
    }

    private drawUp(ctx: CanvasRenderingContext2D, _w: number, _h: number, tunic: string, hat: string, _skin: string, shield: number, attacking: boolean) {
        // Body
        ctx.fillStyle = tunic;
        ctx.fillRect(-6, -4, 12, 14);

        // Hat (Back)
        ctx.fillStyle = hat;
        ctx.fillRect(-6, -12, 12, 10);
        ctx.beginPath();
        ctx.moveTo(-6, -12);
        ctx.lineTo(6, -12);
        ctx.lineTo(0, -20);
        ctx.fill();

        // Shield (Side/Hidden) - usually hidden or on back? 
        // In NES Zelda, shield is on side when walking up? No, usually not visible or on arm.
        if (!attacking) {
            this.drawShield(ctx, 8, 0, shield, true); // Side view of shield
        }
    }

    private drawSide(ctx: CanvasRenderingContext2D, _w: number, _h: number, tunic: string, hat: string, skin: string, shield: number, attacking: boolean, left: boolean) {
        const scale = left ? -1 : 1;
        ctx.scale(scale, 1);

        // Body
        ctx.fillStyle = tunic;
        ctx.fillRect(-4, -4, 8, 14);

        // Head
        ctx.fillStyle = skin;
        ctx.fillRect(-4, -12, 9, 10); // Face profile

        // Hat
        ctx.fillStyle = hat;
        ctx.beginPath();
        ctx.moveTo(-5, -12);
        ctx.lineTo(5, -12);
        ctx.lineTo(-8, -18); // Floppy hat tail
        ctx.fill();

        // Shield (Front/Side)
        if (!attacking) {
            this.drawShield(ctx, 4, 2, shield);
        }
    }

    private drawShield(ctx: CanvasRenderingContext2D, x: number, y: number, level: number, side: boolean = false) {
        const w = side ? 4 : 8;
        const h = 10;

        ctx.fillStyle = level === 2 ? '#C0C0C0' : '#8B4513'; // Magical=Silver, Small=Brown
        ctx.fillRect(x, y, w, h);

        // Detail
        if (!side) {
            ctx.fillStyle = level === 2 ? '#4169E1' : '#CD853F'; // Blue cross or lighter brown
            ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
        }
    }
}
