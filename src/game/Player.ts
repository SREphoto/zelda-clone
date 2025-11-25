import { Input } from './Input';
import { Tilemap } from './Tilemap';
import { Camera } from './Camera';
import { Sprite } from './Sprite';
import { Animation } from './Animation';
import playerSrc from '../assets/player.png';

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

    private sprite: Sprite;
    private animations: { [key: string]: Animation };
    private currentAnimation: Animation;
    private onHealthChange: (health: number) => void;

    constructor(x: number, y: number, onHealthChange: (health: number) => void) {
        this.x = x;
        this.y = y;
        this.onHealthChange = onHealthChange;

        this.sprite = new Sprite(playerSrc);

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
        // Handle Invulnerability
        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer -= dt;
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

        if (input.isDown('Space')) {
            this.attack();
            return;
        }

        let dx = 0;
        let dy = 0;
        let moving = false;

        if (input.isDown('ArrowUp') || input.isDown('KeyW')) { dy -= 1; moving = true; this.direction = 'up'; }
        if (input.isDown('ArrowDown') || input.isDown('KeyS')) { dy += 1; moving = true; this.direction = 'down'; }
        if (input.isDown('ArrowLeft') || input.isDown('KeyA')) { dx -= 1; moving = true; this.direction = 'left'; }
        if (input.isDown('ArrowRight') || input.isDown('KeyD')) { dx += 1; moving = true; this.direction = 'right'; }

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        this.move(dx * this.speed * dt, 0, tilemap);
        this.move(0, dy * this.speed * dt, tilemap);

        // Update Animation
        if (moving) {
            this.currentAnimation = this.animations[this.direction];
            this.currentAnimation.update(dt);
        } else {
            this.currentAnimation = this.animations[`idle-${this.direction}`];
            this.currentAnimation.reset();
        }
    }

    public takeDamage(amount: number, sourceX: number, sourceY: number) {
        if (this.invulnerabilityTimer > 0) return;

        // Apply defense ring reduction
        let damageReduction = 0;
        if (this.defenseRing === 1) damageReduction = 0.25; // Blue ring - 25% reduction
        if (this.defenseRing === 2) damageReduction = 0.5; // Red ring - 50% reduction

        const finalDamage = amount * (1 - damageReduction);

        this.health -= finalDamage;
        this.invulnerabilityTimer = Player.INVULNERABILITY_DURATION;
        this.onHealthChange(this.health);
        console.log('Player Hit! Health:', this.health);

        // Calculate Knockback Direction
        const dx = this.x - sourceX;
        const dy = this.y - sourceY;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > 0) {
            this.knockbackVelocity = {
                x: (dx / length) * 400,
                y: (dy / length) * 400
            };
            this.knockbackTimer = 0.2;
        }
    }

    private move(dx: number, dy: number, tilemap: Tilemap) {
        const newX = this.x + dx;
        const newY = this.y + dy;

        // Check collision at 4 corners
        const points = [
            { x: newX, y: newY },
            { x: newX + this.width, y: newY },
            { x: newX, y: newY + this.height },
            { x: newX + this.width, y: newY + this.height },
        ];

        for (const point of points) {
            if (tilemap.isSolid(point.x, point.y)) {
                return; // Collision detected, don't move
            }
        }

        this.x = newX;
        this.y = newY;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera) {
        const screenX = Math.floor(this.x - camera.x);
        const screenY = Math.floor(this.y - camera.y);

        // Draw Sprite
        const frame = this.currentAnimation.getCurrentFrame();
        const frameX = frame % 4;
        const frameY = Math.floor(frame / 4);

        // Flash if invulnerable
        if (this.invulnerabilityTimer > 0 && Math.floor(this.invulnerabilityTimer * 10) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        this.sprite.draw(
            ctx,
            screenX - 2,
            screenY - 4,
            frameX,
            frameY,
            256,
            256,
            32,
            32
        );

        ctx.globalAlpha = 1.0;

        // Draw Sword if attacking
        if (this.isAttacking) {
            // Sword color based on level
            const swordColors = ['#C0C0C0', '#FFFFFF', '#4169E1', '#FFD700']; // Silver, White, Blue, Gold
            ctx.fillStyle = swordColors[this.swordLevel - 1] || '#C0C0C0';

            let swordX = screenX + this.width / 2;
            let swordY = screenY + this.height / 2;
            let swordW = 20;
            let swordH = 20;

            if (this.direction === 'down') { swordY += 20; swordW = 10; swordH = 30; }
            if (this.direction === 'up') { swordY -= 30; swordW = 10; swordH = 30; }
            if (this.direction === 'left') { swordX -= 30; swordW = 30; swordH = 10; }
            if (this.direction === 'right') { swordX += 20; swordW = 30; swordH = 10; }

            ctx.fillRect(swordX, swordY, swordW, swordH);
        }
    }

    private attack() {
        this.isAttacking = true;
        this.attackCooldown = Player.ATTACK_DURATION;
        console.log('Attacking with sword level', this.swordLevel);
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
}
