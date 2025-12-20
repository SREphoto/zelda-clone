import { Input } from './Input';
import { Tilemap } from './Tilemap';
import { Camera } from './Camera';
import { PlayerSprite } from './sprites/PlayerSprite';
import { Animation } from './Animation';

export class Player {
    public x: number;
    public y: number;
    public width: number = 28;
    public height: number = 28;

    // Health System
    public health: number = 3;
    public maxHealth: number = 3;
    public heartContainers: number = 3;

    // Equipment
    public hasMagicalShield: boolean = false;
    public hasSilverArrows: boolean = false;
    public hasBoomerang: boolean = false;
    public hasCandle: boolean = false;
    public hasLadder: boolean = false;
    public hasMagicRod: boolean = false;
    public hasCompass: boolean = false;
    public hasMap: boolean = false;

    // Equipment Levels
    public swordLevel: number = 1; // 1 = Wooden, 2 = White, 3 = Magical, 4 = Master
    public shieldLevel: number = 1; // 1 = Small, 2 = Magical
    public defenseRing: number = 0; // 0 = none, 1 = blue, 2 = red

    // Inventory
    public keys: number = 0;

    public isAttacking: boolean = false;
    public direction: 'up' | 'down' | 'left' | 'right' = 'down';

    private speed: number = 80;
    private attackCooldown: number = 0;
    private static ATTACK_DURATION = 0.3;
    private invulnerabilityTimer: number = 0;
    private static INVULNERABILITY_DURATION = 1.5;
    private knockbackTimer: number = 0;
    private knockbackVelocity: { x: number, y: number } = { x: 0, y: 0 };
    public swordDisabledTimer: number = 0;

    private sprite: PlayerSprite;
    private animations: { [key: string]: Animation };
    private currentAnimation: Animation;
    private onHealthChange: (health: number) => void;

    constructor(x: number, y: number, onHealthChange: (health: number) => void) {
        this.x = x;
        this.y = y;
        this.onHealthChange = onHealthChange;

        this.sprite = new PlayerSprite();

        // 4 frames per row, 0.15s per frame
        this.animations = {
            'down': new Animation([0, 1, 2, 3], 0.15),
            'left': new Animation([4, 5, 6, 7], 0.15),
            'right': new Animation([8, 9, 10, 11], 0.15),
            'up': new Animation([12, 13, 14, 15], 0.15),
            'idle-down': new Animation([0], 1),
            'idle-left': new Animation([4], 1),
            'idle-right': new Animation([8], 1),
            'idle-up': new Animation([12], 1),
        };

        this.currentAnimation = this.animations['idle-down'];
    }

    public update(dt: number, input: Input, tilemap: Tilemap) {
        // Debug log every 60 frames
        if (Math.floor(Date.now() / 1000) % 1 === 0 && Math.floor(Date.now() % 1000) < 20) {
            console.log('👤 Player.update() called');
        }

        // Handle Invulnerability
        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer -= dt;
        }

        // Handle Sword Disable (Bubble Curse)
        if (this.swordDisabledTimer > 0) {
            this.swordDisabledTimer -= dt;
        }

        // Handle Knockback
        if (this.knockbackTimer > 0) {
            this.knockbackTimer -= dt;
            this.move(this.knockbackVelocity.x * dt, this.knockbackVelocity.y * dt, tilemap);
            return; // Disable input during knockback
        }

        if (this.isAttacking) {
            this.attackCooldown -= dt;
            if (this.attackCooldown <= 0) {
                this.isAttacking = false;
            }
            return; // Don't move while attacking
        }

        let dx = 0;
        let dy = 0;
        let moving = false;

        if (input.isDown('ArrowUp') || input.isDown('KeyW')) { dy -= 1; moving = true; this.direction = 'up'; }
        if (input.isDown('ArrowDown') || input.isDown('KeyS')) { dy += 1; moving = true; this.direction = 'down'; }
        if (input.isDown('ArrowLeft') || input.isDown('KeyA')) { dx -= 1; moving = true; this.direction = 'left'; }
        if (input.isDown('ArrowRight') || input.isDown('KeyD')) { dx += 1; moving = true; this.direction = 'right'; }

        if (moving) {
            console.log('🚶 Player MOVING!', 'Direction:', this.direction, 'dx:', dx, 'dy:', dy);
        }

        // Attack Input
        if (input.isPressed('Space') && this.swordDisabledTimer <= 0) {
            this.attack();
            return;
        }

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
        }

        this.move(dx * this.speed * dt, dy * this.speed * dt, tilemap);

        // Update Animation
        if (moving) {
            this.currentAnimation = this.animations[this.direction];
            this.currentAnimation.update(dt);
        } else {
            // Idle
            if (this.direction === 'up') this.currentAnimation = this.animations['idle-up'];
            else if (this.direction === 'down') this.currentAnimation = this.animations['idle-down'];
            else if (this.direction === 'left') this.currentAnimation = this.animations['idle-left'];
            else if (this.direction === 'right') this.currentAnimation = this.animations['idle-right'];
        }
    }

    private move(dx: number, dy: number, tilemap: Tilemap) {
        const newX = this.x + dx;
        const newY = this.y + dy;

        // Check collisions
        if (!tilemap.isSolid(newX, this.y) && !tilemap.isSolid(newX + this.width, this.y) &&
            !tilemap.isSolid(newX, this.y + this.height) && !tilemap.isSolid(newX + this.width, this.y + this.height)) {
            this.x = newX;
        }

        if (!tilemap.isSolid(this.x, newY) && !tilemap.isSolid(this.x + this.width, newY) &&
            !tilemap.isSolid(this.x, newY + this.height) && !tilemap.isSolid(this.x + this.width, newY + this.height)) {
            this.y = newY;
        }

        // Update direction
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) this.direction = 'right';
            else if (dx < 0) this.direction = 'left';
        } else {
            if (dy > 0) this.direction = 'down';
            else if (dy < 0) this.direction = 'up';
        }
    }

    public takeDamage(amount: number, sourceX: number, sourceY: number) {
        if (this.invulnerabilityTimer > 0) return;

        // Reduce damage based on ring
        let damage = amount;
        if (this.defenseRing === 1) damage = Math.ceil(amount / 2); // Blue Ring: 1/2 damage
        if (this.defenseRing === 2) damage = Math.ceil(amount / 4); // Red Ring: 1/4 damage

        this.health -= damage;
        if (this.health < 0) this.health = 0;
        this.onHealthChange(this.health);

        this.invulnerabilityTimer = Player.INVULNERABILITY_DURATION;

        // Knockback
        const dx = (this.x + this.width / 2) - sourceX;
        const dy = (this.y + this.height / 2) - sourceY;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
            this.knockbackVelocity = { x: (dx / len) * 150, y: (dy / len) * 150 };
            this.knockbackTimer = 0.2;
        }

        console.log(`Player took ${damage} damage! Health: ${this.health}`);
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera) {
        const screenX = Math.floor(this.x - camera.x);
        const screenY = Math.floor(this.y - camera.y);

        // Invulnerability flashing
        if (this.invulnerabilityTimer > 0) {
            if (Math.floor(Date.now() / 50) % 2 === 0) return;
        }

        // Draw Player Sprite FIRST
        this.sprite.draw(
            ctx,
            screenX,
            screenY,
            this.width,
            this.height,
            this.direction,
            this.isAttacking,
            this.swordLevel,
            this.shieldLevel,
            this.defenseRing,
            this.currentAnimation.getCurrentFrame()
        );

        // Draw Sword AFTER (on top of player)
        if (this.isAttacking) {
            console.log('Drawing sword! Direction:', this.direction, 'ScreenPos:', screenX, screenY);

            // Sword color based on level
            const swordColors = ['#FF0000', '#FFFFFF', '#4169E1', '#FFD700']; // RED for visibility, White, Blue, Gold
            const color = swordColors[this.swordLevel - 1] || '#FF0000';

            let swordX = screenX + this.width / 2;
            let swordY = screenY + this.height / 2;
            let swordW = 24;
            let swordH = 24;

            if (this.direction === 'down') { swordY += 16; swordW = 12; swordH = 32; }
            if (this.direction === 'up') { swordY -= 32; swordW = 12; swordH = 32; }
            if (this.direction === 'left') { swordX -= 32; swordW = 32; swordH = 12; }
            if (this.direction === 'right') { swordX += 16; swordW = 32; swordH = 12; }

            // Draw SUPER VISIBLE test rectangle
            ctx.fillStyle = '#00FFFF'; // Cyan - very visible
            ctx.fillRect(swordX, swordY, swordW, swordH);

            // Draw Detailed Sword ON TOP
            if (this.direction === 'up' || this.direction === 'down') {
                // Vertical Sword
                const bladeW = 10;
                const bx = swordX + swordW / 2 - bladeW / 2;

                // Blade - BRIGHT RED
                ctx.fillStyle = color;
                ctx.fillRect(bx, swordY, bladeW, swordH);

                // Hilt (Guard)
                ctx.fillStyle = '#FFD700'; // Gold
                const hiltY = this.direction === 'down' ? swordY : swordY + swordH - 10;
                ctx.fillRect(bx - 8, hiltY, bladeW + 16, 10);

                // Handle (Brown)
                ctx.fillStyle = '#8B4513';
                const handleY = this.direction === 'down' ? swordY - 8 : swordY + swordH;
                ctx.fillRect(bx + 2, handleY, 6, 8);
            } else {
                // Horizontal Sword
                const bladeH = 10;
                const by = swordY + swordH / 2 - bladeH / 2;

                // Blade - BRIGHT RED
                ctx.fillStyle = color;
                ctx.fillRect(swordX, by, swordW, bladeH);

                // Hilt (Guard)
                ctx.fillStyle = '#FFD700';
                const hiltX = this.direction === 'right' ? swordX : swordX + swordW - 10;
                ctx.fillRect(hiltX, by - 8, 10, bladeH + 16);

                // Handle
                ctx.fillStyle = '#8B4513';
                const handleX = this.direction === 'right' ? swordX - 8 : swordX + swordW;
                ctx.fillRect(handleX, by + 2, 8, 6);
            }
        }
    }

    private attack() {
        this.isAttacking = true;
        this.attackCooldown = Player.ATTACK_DURATION;
        console.log('ATTACK TRIGGERED! Sword level:', this.swordLevel, 'Direction:', this.direction);
    }

    public canBlockMagic(projectileDir: { x: number, y: number }): boolean {
        if (!this.hasMagicalShield) return false;
        if (this.isAttacking) return false;

        let px = 0;
        let py = 0;
        if (this.direction === 'up') py = -1;
        if (this.direction === 'down') py = 1;
        if (this.direction === 'left') px = -1;
        if (this.direction === 'right') px = 1;

        const dot = px * projectileDir.x + py * projectileDir.y;
        return dot < -0.5;
    }

    public getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
