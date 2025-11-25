import { Sprite } from './Sprite';
import { Tilemap } from './Tilemap';
import { Projectile } from './Projectile';
import { Player } from './Player';
import { Camera } from './Camera';
import enemySrc from '../assets/enemies.png';
import bossSrc from '../assets/bosses.png';

export const EnemyType = {
    OctorokRed: 0,
    OctorokBlue: 1,
    TektiteRed: 2,
    TektiteBlue: 3,
    MoblinRed: 4,
    MoblinBlue: 5,
    DarknutRed: 6,
    DarknutBlue: 7,
    Dodongo: 8,
    Gohma: 9,
    Stalfos: 10,
    Keese: 11,
    Zol: 12,
    Gel: 13,
    WizzrobeRed: 14,
    WizzrobeBlue: 15,
    Aquamentus: 16,
    Ganon: 17
} as const;
export type EnemyType = typeof EnemyType[keyof typeof EnemyType];

export const EnemyState = {
    Idle: 0,
    Moving: 1,
    Attacking: 2,
    Stunned: 3,
    Jumping: 4,
    EyeClosed: 5,
    EyeOpen: 6,
    Flying: 7, // For Keese
    Resting: 8, // For Keese
    TeleportOut: 9, // For Wizzrobe
    TeleportIn: 10, // For Wizzrobe
    Invisible: 11 // For Ganon
} as const;
export type EnemyState = typeof EnemyState[keyof typeof EnemyState];

export class Enemy {
    public x: number;
    public y: number;
    public z: number = 0; // Height for jumping
    public width: number = 16;
    public height: number = 16;
    public health: number;
    public type: EnemyType;
    public state: EnemyState = EnemyState.Moving;

    private speed: number;
    private sprite: Sprite;
    private bossSprite: Sprite;
    private useBossSprite: boolean = false;
    private direction: { x: number, y: number } = { x: 0, y: 1 };

    private moveTimer: number = 0;

    // Immunities (Bitflags)
    // Bit 0: Sword, Bit 1: Boomerang, Bit 2: Arrow, Bit 3: Bomb, Bit 4: Rod, Bit 5: Fire
    public immunityFlags: number = 0;

    // Jumping Properties (Tektite)
    private jumpTarget: { x: number, y: number } | null = null;
    private jumpDuration: number = 0;
    private jumpTimer: number = 0;

    // Authentic Knockback (Fixed speed 4px/frame = ~240px/s)
    private knockbackTimer: number = 0;
    private knockbackDir: { x: number, y: number } = { x: 0, y: 0 };
    private isKnockedBack: boolean = false;
    private invulnerabilityTimer: number = 0;
    private stunTimer: number = 0;

    private static GRID_SIZE = 16;
    private static KNOCKBACK_SPEED = 240; // 4px per frame at 60fps

    constructor(x: number, y: number, type: EnemyType = EnemyType.OctorokRed) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.sprite = new Sprite(enemySrc);
        this.bossSprite = new Sprite(bossSrc);

        // Determine if boss
        if (this.type === EnemyType.Aquamentus ||
            this.type === EnemyType.Dodongo ||
            this.type === EnemyType.Gohma ||
            this.type === EnemyType.Ganon) {
            this.useBossSprite = true;
        }

        // Initialize stats based on type
        switch (this.type) {
            case EnemyType.OctorokRed:
                this.health = 2;
                this.speed = 30;
                break;
            case EnemyType.OctorokBlue:
                this.health = 3;
                this.speed = 40;
                break;
            case EnemyType.TektiteRed:
                this.health = 2;
                this.speed = 60;
                this.state = EnemyState.Idle;
                break;
            case EnemyType.TektiteBlue:
                this.health = 2;
                this.speed = 60;
                this.state = EnemyState.Idle;
                break;
            case EnemyType.MoblinRed:
                this.health = 3;
                this.speed = 30;
                break;
            case EnemyType.MoblinBlue:
                this.health = 4;
                this.speed = 30;
                break;
            case EnemyType.DarknutRed:
                this.health = 4;
                this.speed = 30;
                break;
            case EnemyType.DarknutBlue:
                this.health = 6;
                this.speed = 45;
                break;
            case EnemyType.Dodongo:
                this.health = 8; // High health, but bombs kill it fast
                this.speed = 20; // Slow
                break;
            case EnemyType.Gohma:
                this.health = 6; // Requires 3 arrows (2 damage each)
                this.speed = 40;
                this.width = 32; // Bigger boss
                this.height = 16;
                this.state = EnemyState.EyeClosed;
                this.moveTimer = 2.0; // Time before opening eye
                break;
            case EnemyType.Stalfos:
                this.health = 2;
                this.speed = 30;
                break;
            case EnemyType.Keese:
                this.health = 1; // Very weak
                this.speed = 50; // Fast
                this.state = EnemyState.Resting;
                this.moveTimer = 1.0;
                break;
            case EnemyType.Zol:
                this.health = 2; // Splits on hit/death
                this.speed = 25; // Slow
                break;
            case EnemyType.Gel:
                this.health = 1; // Very weak
                this.speed = 60; // Fast
                this.width = 8; // Small
                this.height = 8;
                this.state = EnemyState.Idle;
                this.moveTimer = 0.5;
                break;
            case EnemyType.WizzrobeRed:
                this.health = 4;
                this.speed = 0; // Teleports
                this.state = EnemyState.TeleportIn;
                this.moveTimer = 1.0;
                break;
            case EnemyType.WizzrobeBlue:
                this.health = 6;
                this.speed = 30;
                this.state = EnemyState.Moving;
                this.moveTimer = 1.0; // Move duration
                break;
            case EnemyType.Aquamentus:
                this.health = 12;
                this.speed = 10;
                this.width = 24;
                this.height = 32;
                this.state = EnemyState.Moving;
                this.moveTimer = 2.0;
                break;
            case EnemyType.Ganon:
                this.health = 16;
                this.speed = 40;
                this.width = 32;
                this.height = 32;
                this.state = EnemyState.Invisible;
                this.moveTimer = 1.0;
                break;
            default:
                this.health = 2;
                this.speed = 30;
        }

        // Align to grid
        this.x = Math.round(this.x / Enemy.GRID_SIZE) * Enemy.GRID_SIZE;
        this.y = Math.round(this.y / Enemy.GRID_SIZE) * Enemy.GRID_SIZE;

        // Random initial direction
        this.changeDirection();
    }

    public update(dt: number, tilemap: Tilemap, projectiles: Projectile[], player: Player) {
        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer -= dt;
        }

        if (this.stunTimer > 0) {
            this.stunTimer -= dt;
            return; // Skip movement/attack if stunned
        }

        if (this.isKnockedBack) {
            this.handleKnockback(dt, tilemap);
            return;
        }

        // State Machine
        switch (this.type) {
            case EnemyType.OctorokRed:
            case EnemyType.OctorokBlue:
                this.updateOctorok(dt, tilemap, projectiles);
                break;
            case EnemyType.TektiteRed:
            case EnemyType.TektiteBlue:
                this.updateTektite(dt, tilemap);
                break;
            case EnemyType.MoblinRed:
            case EnemyType.MoblinBlue:
                this.updateMoblin(dt, tilemap, projectiles, player);
                break;
            case EnemyType.DarknutRed:
            case EnemyType.DarknutBlue:
                this.updateDarknut(dt, tilemap);
                break;
            case EnemyType.Dodongo:
                this.updateDodongo(dt, tilemap);
                break;
            case EnemyType.Gohma:
                this.updateGohma(dt, tilemap, projectiles);
                break;
            case EnemyType.Stalfos:
                this.updateStalfos(dt, tilemap);
                break;
            case EnemyType.Keese:
                this.updateKeese(dt, tilemap);
                break;
            case EnemyType.Zol:
                this.updateZol(dt, tilemap);
                break;
            case EnemyType.Gel:
                this.updateGel(dt, tilemap);
                break;
            case EnemyType.WizzrobeRed:
                this.updateWizzrobeRed(dt, tilemap, projectiles, player);
                break;
            case EnemyType.WizzrobeBlue:
                this.updateWizzrobeBlue(dt, tilemap, projectiles, player);
                break;
            case EnemyType.Aquamentus:
                this.updateAquamentus(dt, tilemap, projectiles, player);
                break;
            case EnemyType.Ganon:
                this.updateGanon(dt, tilemap, projectiles, player);
                break;
        }
    }

    private updateStalfos(dt: number, tilemap: Tilemap) {
        // Stalfos: Simple Wander (like Octorok but no shooting)
        if (this.state === EnemyState.Moving) {
            this.moveGridBased(dt, tilemap);
            if (Math.random() < 0.02) {
                this.changeDirection();
            }
        } else {
            this.state = EnemyState.Moving;
        }
    }

    private updateKeese(dt: number, _tilemap: Tilemap) {
        // Keese: Fly (Ignore Walls) -> Rest -> Fly
        if (this.state === EnemyState.Flying) {
            this.moveTimer -= dt;
            const moveAmt = this.speed * dt;

            // Simple movement: Move in current direction
            // Keese bounce off screen edges but ignore walls
            let nextX = this.x + this.direction.x * moveAmt;
            let nextY = this.y + this.direction.y * moveAmt;

            // Screen Bounds Check (assuming 0-width, 0-height for simplicity, or passed in)
            // Hardcoded for now based on Game.ts width/height (512x352)
            // Actually, tilemap isn't used for collision here, but we need to stay in bounds.
            if (nextX < 32 || nextX > 512 - 32 - this.width) {
                this.direction.x *= -1;
                nextX = this.x + this.direction.x * moveAmt;
            }
            if (nextY < 32 || nextY > 352 - 32 - this.height) {
                this.direction.y *= -1;
                nextY = this.y + this.direction.y * moveAmt;
            }

            this.x = nextX;
            this.y = nextY;

            // Randomly change direction while flying
            if (Math.random() < 0.05) {
                this.changeDirection();
            }

            if (this.moveTimer <= 0) {
                this.state = EnemyState.Resting;
                this.moveTimer = 0.5 + Math.random() * 1.0;
            }
        } else if (this.state === EnemyState.Resting) {
            this.moveTimer -= dt;
            if (this.moveTimer <= 0) {
                this.state = EnemyState.Flying;
                this.moveTimer = 1.0 + Math.random() * 2.0;
                this.changeDirection();
                // Speed up when starting to fly?
                this.speed = 40 + Math.random() * 40;
            }
        }
    }

    private updateZol(dt: number, tilemap: Tilemap) {
        // Zol: Slow Wander
        if (this.state === EnemyState.Moving) {
            this.moveGridBased(dt, tilemap);
            if (Math.random() < 0.01) {
                this.changeDirection();
            }
        } else {
            this.state = EnemyState.Moving;
        }
    }

    private updateGel(dt: number, tilemap: Tilemap) {
        // Gel: Fast, Erratic, Short Bursts
        if (this.state === EnemyState.Moving) {
            this.moveTimer -= dt;
            this.moveGridBased(dt, tilemap);

            if (this.moveTimer <= 0) {
                this.state = EnemyState.Idle;
                this.moveTimer = 0.5 + Math.random() * 0.5;
            }
        } else if (this.state === EnemyState.Idle) {
            this.moveTimer -= dt;
            if (this.moveTimer <= 0) {
                this.state = EnemyState.Moving;
                this.moveTimer = 0.5 + Math.random() * 0.5;
                this.changeDirection();
            }
        }
    }

    private updateDodongo(dt: number, tilemap: Tilemap) {
        // Dodongo AI: Slow Wander
        if (this.state === EnemyState.Moving) {
            this.moveGridBased(dt, tilemap);
            if (Math.random() < 0.01) {
                this.changeDirection();
            }
        } else if (this.state === EnemyState.Idle) {
            this.state = EnemyState.Moving;
        } else if (this.state === EnemyState.Stunned) {
            // Stunned by Bomb
            this.stunTimer -= dt;
            if (this.stunTimer <= 0) {
                this.state = EnemyState.Moving;
                this.stunTimer = 0;
            }
        }
    }

    private updateGohma(dt: number, _tilemap: Tilemap, projectiles: Projectile[]) {
        // Gohma AI: Move Horizontal, Open/Close Eye

        // Timer for Eye State
        this.moveTimer -= dt;
        if (this.moveTimer <= 0) {
            if (this.state === EnemyState.EyeClosed) {
                this.state = EnemyState.EyeOpen;
                this.moveTimer = 1.5; // Open for 1.5s
            } else {
                this.state = EnemyState.EyeClosed;
                this.moveTimer = 2.0; // Closed for 2.0s
                // Maybe shoot when closing?
                if (Math.random() < 0.5) {
                    this.shoot(projectiles);
                }
            }
        }

        // Movement (Side to Side)
        if (this.state === EnemyState.EyeClosed) {
            // Only move when eye is closed
            const moveAmt = this.speed * dt;
            const nextX = this.x + this.direction.x * moveAmt;

            // Simple bounds check (keep in middle area)
            if (nextX < 100 || nextX > 700) {
                this.direction.x *= -1;
            }

            this.x += this.direction.x * moveAmt;
        }
    }

    private updateDarknut(dt: number, tilemap: Tilemap) {
        // Darknut AI: Random Grid Movement
        if (this.state === EnemyState.Moving) {
            this.moveGridBased(dt, tilemap);

            if (Math.random() < 0.02) {
                this.changeDirection();
            }
        } else if (this.state === EnemyState.Idle) {
            this.state = EnemyState.Moving;
        }
    }

    private updateMoblin(dt: number, tilemap: Tilemap, projectiles: Projectile[], player: { x: number, y: number }) {
        if (this.state === EnemyState.Moving) {
            this.moveGridBased(dt, tilemap);

            // Check alignment with player
            const dx = Math.abs(this.x - player.x);
            const dy = Math.abs(this.y - player.y);
            const alignedX = dx < 16;
            const alignedY = dy < 16;

            if ((alignedX || alignedY) && Math.random() < 0.05) {
                // Fire spear!
                let dir = { x: 0, y: 0 };
                if (alignedX) dir.y = player.y > this.y ? 1 : -1;
                if (alignedY) dir.x = player.x > this.x ? 1 : -1;

                projectiles.push(new Projectile(this.x + 8, this.y + 8, dir, 150, 1, false));
            }

            if (Math.random() < 0.01) {
                this.changeDirection();
            }
        } else if (this.state === EnemyState.Idle) {
            this.state = EnemyState.Moving;
        }
    }

    private updateOctorok(dt: number, tilemap: Tilemap, projectiles: Projectile[]) {
        if (this.state === EnemyState.Moving) {
            this.moveGridBased(dt, tilemap);
            if (Math.random() < 0.01) {
                this.state = EnemyState.Idle;
                this.moveTimer = 0.5 + Math.random() * 1.0;
            }
        } else if (this.state === EnemyState.Idle) {
            this.moveTimer -= dt;
            if (this.moveTimer <= 0) {
                if (Math.random() < 0.3) {
                    this.shoot(projectiles);
                } else {
                    this.state = EnemyState.Moving;
                    this.changeDirection();
                }
            }
        }
    }

    private updateTektite(dt: number, tilemap: Tilemap) {
        if (this.state === EnemyState.Idle) {
            this.moveTimer -= dt;
            if (this.moveTimer <= 0) {
                this.startJump(tilemap);
            }
        } else if (this.state === EnemyState.Jumping) {
            if (!this.jumpTarget) return;

            this.jumpTimer += dt;
            const progress = Math.min(this.jumpTimer / this.jumpDuration, 1.0);

            const dx = this.jumpTarget.x - this.x;
            const dy = this.jumpTarget.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const moveAmt = this.speed * dt;

            if (dist > moveAmt) {
                this.x += (dx / dist) * moveAmt;
                this.y += (dy / dist) * moveAmt;
            } else {
                this.x = this.jumpTarget.x;
                this.y = this.jumpTarget.y;
            }

            const jumpHeight = 30;
            this.z = 4 * jumpHeight * progress * (1 - progress);

            if (progress >= 1.0) {
                this.z = 0;
                this.state = EnemyState.Idle;
                const waitTime = this.type === EnemyType.TektiteRed ? 0.5 : 1.5;
                this.moveTimer = waitTime + Math.random() * 0.5;
            }
        }
    }

    private startJump(_tilemap: Tilemap) {
        const range = 60;
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * (range - 30);

        let tx = this.x + Math.cos(angle) * dist;
        let ty = this.y + Math.sin(angle) * dist;

        tx = Math.max(32, Math.min(tx, 800 - 32));
        ty = Math.max(32, Math.min(ty, 600 - 32));

        this.jumpTarget = { x: tx, y: ty };
        this.state = EnemyState.Jumping;

        const totalDist = Math.sqrt(Math.pow(tx - this.x, 2) + Math.pow(ty - this.y, 2));
        this.jumpDuration = totalDist / this.speed;
        this.jumpTimer = 0;
    }

    private updateWizzrobeRed(dt: number, tilemap: Tilemap, projectiles: Projectile[], player: { x: number, y: number }) {
        // Red Wizzrobe: Teleport -> Shoot -> Teleport
        if (this.state === EnemyState.TeleportIn) {
            this.moveTimer -= dt;
            if (this.moveTimer <= 0) {
                // Shoot Magic
                this.shootMagic(projectiles, player);
                this.state = EnemyState.TeleportOut;
                this.moveTimer = 1.0; // Time to fade out
            }
        } else if (this.state === EnemyState.TeleportOut) {
            this.moveTimer -= dt;
            if (this.moveTimer <= 0) {
                // Teleport!
                this.teleport(tilemap);
                this.state = EnemyState.TeleportIn;
                this.moveTimer = 1.0; // Time to fade in
            }
        }
    }

    private updateWizzrobeBlue(dt: number, _tilemap: Tilemap, projectiles: Projectile[], player: { x: number, y: number }) {
        // Blue Wizzrobe: Move (Ghost) -> Stop -> Shoot -> Move
        if (this.state === EnemyState.Moving) {
            this.moveTimer -= dt;

            // Move through walls (no tilemap check)
            const moveAmt = this.speed * dt;
            this.x += this.direction.x * moveAmt;
            this.y += this.direction.y * moveAmt;

            // Bounds check
            if (this.x < 32 || this.x > 512 - 32 || this.y < 32 || this.y > 352 - 32) {
                this.changeDirection();
                this.x = Math.max(32, Math.min(this.x, 512 - 32));
                this.y = Math.max(32, Math.min(this.y, 352 - 32));
            }

            if (this.moveTimer <= 0) {
                this.state = EnemyState.Attacking;
                this.moveTimer = 0.5; // Stop duration
            }
        } else if (this.state === EnemyState.Attacking) {
            this.moveTimer -= dt;
            if (this.moveTimer <= 0) {
                this.shootMagic(projectiles, player);
                this.state = EnemyState.Moving;
                this.moveTimer = 1.0 + Math.random() * 2.0;
                this.changeDirection();
            }
        }
    }

    private updateAquamentus(dt: number, _tilemap: Tilemap, projectiles: Projectile[], player: { x: number, y: number }) {
        // Aquamentus: Move Y, Shoot 3 Fireballs
        this.moveTimer -= dt;

        // Movement
        const moveAmt = this.speed * dt;
        this.y += this.direction.y * moveAmt;

        // Bounce Y
        if (this.y < 100 || this.y > 250) {
            this.direction.y *= -1;
        }

        // Shoot
        if (this.moveTimer <= 0) {
            this.shootFireballs(projectiles, player);
            this.moveTimer = 2.0 + Math.random();
        }
    }

    private updateGanon(dt: number, tilemap: Tilemap, projectiles: Projectile[], player: { x: number, y: number }) {
        if (this.state === EnemyState.Invisible) {
            this.moveTimer -= dt;
            this.moveGridBased(dt, tilemap);

            if (this.moveTimer <= 0) {
                // Change direction or shoot
                if (Math.random() < 0.3) {
                    this.shootFireball(projectiles, player);
                }
                this.changeDirection();
                this.moveTimer = 0.5 + Math.random();
            }
        } else if (this.state === EnemyState.Stunned) {
            this.stunTimer -= dt;
            if (this.stunTimer <= 0) {
                this.state = EnemyState.Invisible;
                this.invulnerabilityTimer = 0;
            }
        }
    }

    private shootFireballs(projectiles: Projectile[], player: { x: number, y: number }) {
        const speed = 150;
        // Aim at player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const angle = Math.atan2(dy, dx);

        const angles = [angle, angle - 0.5, angle + 0.5]; // ~30 degrees spread

        angles.forEach(a => {
            const dir = { x: Math.cos(a), y: Math.sin(a) };
            projectiles.push(new Projectile(this.x + this.width / 2, this.y + this.height / 2, dir, speed, 2, true)); // Magic/Fireball
        });
    }

    private shootFireball(projectiles: Projectile[], player: { x: number, y: number }) {
        const speed = 180;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const angle = Math.atan2(dy, dx);
        const dir = { x: Math.cos(angle), y: Math.sin(angle) };

        projectiles.push(new Projectile(this.x + this.width / 2, this.y + this.height / 2, dir, speed, 2, true));
    }

    private teleport(_tilemap: Tilemap) {
        // Find a random valid spot
        // For simplicity, just pick a random spot in bounds
        // In a real game, we'd check if it's walkable
        const rangeX = 14; // 16 tiles wide -> 1-14
        const rangeY = 9;  // 11 tiles high -> 1-9

        const tx = (1 + Math.floor(Math.random() * rangeX)) * Enemy.GRID_SIZE;
        const ty = (1 + Math.floor(Math.random() * rangeY)) * Enemy.GRID_SIZE;

        this.x = tx;
        this.y = ty;
    }

    private shootMagic(projectiles: Projectile[], player: { x: number, y: number }) {
        const magicSpeed = 200;
        const damage = this.type === EnemyType.WizzrobeBlue ? 2 : 1; // Blue hits harder

        // Aim at player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const dir = len > 0 ? { x: dx / len, y: dy / len } : { x: 1, y: 0 };

        projectiles.push(new Projectile(this.x + 8, this.y + 8, dir, magicSpeed, damage, true));
    }

    private shoot(projectiles: Projectile[]) {
        const rockSpeed = 150;
        const damage = this.type === EnemyType.OctorokBlue ? 1 : 0.5;

        const px = this.x + this.width / 2 - 4 + (this.direction.x * 10);
        const py = this.y + this.height / 2 - 4 + (this.direction.y * 10);

        projectiles.push(new Projectile(px, py, { ...this.direction }, rockSpeed, damage, false));
        this.state = EnemyState.Moving;
    }

    private handleKnockback(dt: number, tilemap: Tilemap) {
        this.knockbackTimer -= dt;
        if (this.knockbackTimer <= 0) {
            this.isKnockedBack = false;
            this.x = Math.round(this.x / Enemy.GRID_SIZE) * Enemy.GRID_SIZE;
            this.y = Math.round(this.y / Enemy.GRID_SIZE) * Enemy.GRID_SIZE;
            return;
        }

        const moveAmt = Enemy.KNOCKBACK_SPEED * dt;
        const nextX = this.x + this.knockbackDir.x * moveAmt;
        const nextY = this.y + this.knockbackDir.y * moveAmt;

        if (tilemap.isSolid(nextX + this.width / 2, nextY + this.height / 2)) {
            this.knockbackTimer = 0;
            this.isKnockedBack = false;
            return;
        }

        this.x = nextX;
        this.y = nextY;
    }

    private moveGridBased(dt: number, tilemap: Tilemap) {
        const moveAmt = this.speed * dt;
        const nextX = this.x + this.direction.x * moveAmt;
        const nextY = this.y + this.direction.y * moveAmt;

        const margin = 2;
        if (tilemap.isSolid(nextX + margin, nextY + margin) ||
            tilemap.isSolid(nextX + this.width - margin, nextY + this.height - margin) ||
            tilemap.isSolid(nextX + this.width - margin, nextY + margin) ||
            tilemap.isSolid(nextX + margin, nextY + this.height - margin)) {

            this.changeDirection();
            return;
        }

        this.x = nextX;
        this.y = nextY;

        const distToGridX = Math.abs(this.x % Enemy.GRID_SIZE);
        const distToGridY = Math.abs(this.y % Enemy.GRID_SIZE);
        const threshold = 1.0;

        if (distToGridX < threshold && distToGridY < threshold) {
            if (Math.random() < 0.05) {
                this.changeDirection();
            }
        }
    }

    public takeDamage(amount: number, knockbackDir: { x: number, y: number }, weaponType: 'sword' | 'boomerang' | 'arrow' | 'bomb' | 'silver-arrow' = 'sword') {
        if (this.invulnerabilityTimer > 0) return;

        // Boomerang always stuns (no damage)
        if (weaponType === 'boomerang') {
            this.stunTimer = 2.0;
            console.log('Enemy Stunned by Boomerang!');
            return;
        }

        // Check Immunities
        let immune = false;
        if (weaponType === 'sword' && (this.immunityFlags & 1)) immune = true;
        if (weaponType === 'boomerang' && (this.immunityFlags & 2)) immune = true;
        if ((weaponType === 'arrow' || weaponType === 'silver-arrow') && (this.immunityFlags & 4)) immune = true;
        if (weaponType === 'bomb' && (this.immunityFlags & 8)) immune = true;

        if (immune) {
            return;
        }

        // Directional Defense (Darknuts)
        if (this.type === EnemyType.DarknutRed || this.type === EnemyType.DarknutBlue) {
            const dot = this.direction.x * knockbackDir.x + this.direction.y * knockbackDir.y;
            if (dot < -0.5) {
                console.log('Blocked!');
                return;
            }
        }

        // Dodongo Vulnerability
        if (this.type === EnemyType.Dodongo) {
            if (weaponType === 'bomb') {
                this.state = EnemyState.Stunned;
                this.stunTimer = 3.0;
                console.log('Dodongo Stunned!');
                return;
            }

            if (this.state !== EnemyState.Stunned) {
                console.log('Dodongo is armored!');
                return;
            }
        }

        // Gohma Vulnerability
        if (this.type === EnemyType.Gohma) {
            if ((weaponType === 'arrow' || weaponType === 'silver-arrow') && this.state === EnemyState.EyeOpen) {
                // Vulnerable!
                console.log('Gohma Hit!');
            } else {
                // Invulnerable
                console.log('Gohma Invulnerable!');
                return;
            }
        }

        // Ganon Vulnerability
        if (this.type === EnemyType.Ganon) {
            if (this.state === EnemyState.Invisible) {
                if (weaponType === 'sword') {
                    this.state = EnemyState.Stunned;
                    this.stunTimer = 3.0;
                    console.log('Ganon Stunned!');
                    return; // Don't take damage, just stun
                } else {
                    return; // Invulnerable
                }
            } else if (this.state === EnemyState.Stunned) {
                if (weaponType === 'silver-arrow') {
                    console.log('Ganon Hit by Silver Arrow!');
                    // Fatal hit
                    this.health = 0;
                } else {
                    return; // Only Silver Arrow kills him
                }
            }
        }

        this.health -= amount;
        this.invulnerabilityTimer = 0.5;

        this.isKnockedBack = true;
        this.knockbackTimer = 0.15;
        this.knockbackDir = knockbackDir;
    }

    private changeDirection() {
        const dirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        const opposite = { x: -this.direction.x, y: -this.direction.y };
        const validDirs = dirs.filter(d => d.x !== opposite.x || d.y !== opposite.y);
        const pool = validDirs.length > 0 ? validDirs : dirs;

        this.direction = pool[Math.floor(Math.random() * pool.length)];

        this.x = Math.round(this.x / Enemy.GRID_SIZE) * Enemy.GRID_SIZE;
        this.y = Math.round(this.y / Enemy.GRID_SIZE) * Enemy.GRID_SIZE;
    }

    public render(ctx: CanvasRenderingContext2D, camera: Camera) {
        const screenX = Math.floor(this.x - camera.x);
        const screenY = Math.floor(this.y - camera.y - this.z);

        if (this.invulnerabilityTimer > 0 && Math.floor(this.invulnerabilityTimer * 20) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        if (this.type === EnemyType.OctorokBlue) {
            ctx.filter = 'hue-rotate(180deg)';
        } else if (this.type === EnemyType.TektiteRed) {
            ctx.filter = 'sepia(1) saturate(5) hue-rotate(-50deg)';
        } else if (this.type === EnemyType.TektiteBlue) {
            ctx.filter = 'sepia(1) saturate(5) hue-rotate(180deg)';
        } else if (this.type === EnemyType.Dodongo) {
            ctx.filter = 'sepia(1) saturate(2) hue-rotate(50deg)'; // Greenish/Yellow
        } else if (this.type === EnemyType.Gohma) {
            ctx.filter = 'invert(1)'; // White/Black look
        } else if (this.type === EnemyType.Stalfos) {
            ctx.filter = 'grayscale(100%) brightness(1.5)'; // Skeleton look
        } else if (this.type === EnemyType.Keese) {
            ctx.filter = 'grayscale(100%) brightness(0.5)'; // Dark/Black
        } else if (this.type === EnemyType.Zol || this.type === EnemyType.Gel) {
            ctx.filter = 'sepia(1) saturate(3) hue-rotate(90deg)'; // Green Slime
        } else if (this.type === EnemyType.WizzrobeRed) {
            ctx.filter = 'hue-rotate(-50deg) saturate(3)'; // Red/Orange
            if (this.state === EnemyState.TeleportIn) {
                ctx.globalAlpha = Math.max(0, Math.min(1, 1.0 - this.moveTimer)); // Fade In
            } else if (this.state === EnemyState.TeleportOut) {
                ctx.globalAlpha = Math.max(0, Math.min(1, this.moveTimer)); // Fade Out
            }
        } else if (this.type === EnemyType.WizzrobeBlue) {
            ctx.filter = 'hue-rotate(180deg) saturate(2)'; // Blue
        } else if (this.type === EnemyType.Aquamentus) {
            ctx.filter = 'hue-rotate(90deg) saturate(3)'; // Green Dragon
        } else if (this.type === EnemyType.Ganon) {
            if (this.state === EnemyState.Invisible) {
                ctx.globalAlpha = 0; // Invisible
            } else {
                ctx.filter = 'hue-rotate(180deg) saturate(0)'; // Blue/Greyish
            }
        }

        const spriteToUse = this.useBossSprite ? this.bossSprite : this.sprite;

        spriteToUse.draw(
            ctx,
            screenX,
            screenY,
            0, 0,
            spriteToUse.width,
            spriteToUse.height,
            this.width,
            this.height
        );

        // Render Gohma Eye
        if (this.type === EnemyType.Gohma) {
            const eyeX = screenX + this.width / 2;
            const eyeY = screenY + this.height / 2;

            ctx.fillStyle = '#000000'; // Eye socket
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeY, 6, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            if (this.state === EnemyState.EyeOpen) {
                ctx.fillStyle = '#FF0000'; // Open Eye (Red)
                ctx.beginPath();
                ctx.ellipse(eyeX, eyeY, 4, 3, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = '#AAAAAA'; // Closed Eyelid
                ctx.beginPath();
                ctx.ellipse(eyeX, eyeY, 6, 1, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        if (this.z > 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(screenX + this.width / 2, screenY + this.height + this.z - 5, 6, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.filter = 'none';
        ctx.globalAlpha = 1.0;
    }
}
