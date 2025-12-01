import { EnemySprite } from './sprites/EnemySprite';
import { Tilemap } from './Tilemap';
import { Projectile } from './Projectile';
import { Player } from './Player';
import { Camera } from './Camera';
import { Boomerang } from './Boomerang';


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
    Ganon: 17,
    LeeverRed: 18,
    LeeverBlue: 19,
    Peahat: 20,
    LynelRed: 21,
    LynelBlue: 22,
    Zola: 23,
    Armos: 24,
    Ghini: 25,
    Rope: 26,
    GoriyaRed: 27,
    GoriyaBlue: 28,
    Wallmaster: 29,
    PolsVoice: 30,
    LikeLike: 31,
    Gibdo: 32,
    Moldorm: 33,
    Bubble: 34,
    Manhandla: 35,
    Gleeok: 36,
    Digdogger: 37,
    Vire: 38
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
    public health: number = 2;
    public type: EnemyType;
    public state: EnemyState = EnemyState.Moving;

    private speed: number = 30;
    private sprite: EnemySprite;
    public direction: { x: number, y: number } = { x: 0, y: 1 };

    private moveTimer: number = 0;

    // Immunities (Bitflags)
    // Bit 0: Sword, Bit 1: Boomerang, Bit 2: Arrow, Bit 3: Bomb, Bit 4: Rod, Bit 5: Fire
    public immunityFlags: number = 0;

    // Jumping Properties (Tektite)
    private jumpTarget: { x: number, y: number } | null = null;
    private jumpDuration: number = 0;
    public jumpTimer: number = 0;

    // Authentic Knockback (Fixed speed 4px/frame = ~240px/s)
    private knockbackTimer: number = 0;
    private knockbackDir: { x: number, y: number } = { x: 0, y: 0 };
    private isKnockedBack: boolean = false;
    public invulnerabilityTimer: number = 0;
    private stunTimer: number = 0;

    private static GRID_SIZE = 16;
    private static KNOCKBACK_SPEED = 240; // 4px per frame at 60fps

    constructor(x: number, y: number, type: EnemyType = EnemyType.OctorokRed) {
        this.x = x;
        this.y = y;
        this.type = type;

        this.type = type;

        this.sprite = new EnemySprite();

        // Initialize stats based on type

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
                this.width = 32;
                this.height = 32;
                this.state = EnemyState.Invisible;
                this.moveTimer = 1.0;
                break;
            case EnemyType.Zola:
                this.health = 2;
                this.speed = 0; // Static (water)
                this.state = EnemyState.Idle; // Submerged
                this.moveTimer = 2.0;
                break;
            case EnemyType.Wallmaster:
                this.health = 2;
                this.speed = 20;
                break;
            case EnemyType.PolsVoice:
                this.health = 10; // Weak to arrows
                this.speed = 40;
                this.state = EnemyState.Jumping;
                break;
            case EnemyType.LikeLike:
                this.health = 6;
                this.speed = 25;
                break;
            case EnemyType.Gibdo:
                this.health = 8;
                this.speed = 30;
                break;
            case EnemyType.Moldorm:
                this.health = 4;
                this.speed = 40;
                break;
            case EnemyType.Bubble:
                this.health = 255; // Invincible
                this.speed = 50;
                break;
            case EnemyType.LeeverRed:
                this.health = 2;
                this.speed = 30;
                this.state = EnemyState.Idle; // Buried
                break;
            case EnemyType.LeeverBlue:
                this.health = 4;
                this.speed = 40;
                this.state = EnemyState.Idle; // Buried
                break;
            case EnemyType.Peahat:
                this.health = 2;
                this.speed = 40;
                this.state = EnemyState.Flying;
                this.moveTimer = 3.0;
                break;
            case EnemyType.LynelRed:
                this.health = 6;
                this.speed = 40;
                break;
            case EnemyType.LynelBlue:
                this.health = 8;
                this.speed = 50;
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

    public update(dt: number, tilemap: Tilemap, projectiles: Projectile[], player: Player, boomerangs: Boomerang[] = []) {
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
            case EnemyType.Rope:
                this.updateRope(dt, tilemap, player);
                break;
            case EnemyType.Armos:
                this.updateArmos(dt, tilemap, player);
                break;
            case EnemyType.Ghini:
                this.updateGhini(dt, player);
                break;
            case EnemyType.Zola:
                this.updateZola(dt, projectiles, player);
                break;
            case EnemyType.Wallmaster:
                this.updateWallmaster(dt, tilemap, player);
                break;
            case EnemyType.PolsVoice:
                this.updatePolsVoice(dt, tilemap, player);
                break;
            case EnemyType.LeeverRed:
            case EnemyType.LeeverBlue:
                this.updateLeever(dt, tilemap, player);
                break;
            case EnemyType.Peahat:
                this.updatePeahat(dt, tilemap);
                break;
            case EnemyType.LynelRed:
            case EnemyType.LynelBlue:
                this.updateLynel(dt, tilemap, projectiles, player);
                break;
            case EnemyType.GoriyaRed:
            case EnemyType.GoriyaBlue:
                this.updateGoriya(dt, tilemap, boomerangs, player);
                break;
            case EnemyType.LikeLike:
                this.updateLikeLike(dt, tilemap, player);
                break;
            case EnemyType.Gibdo:
                this.updateGibdo(dt, tilemap);
                break;
            case EnemyType.Bubble:
                this.updateBubble(dt, tilemap);
                break;
            case EnemyType.Moldorm:
                this.updateMoldorm(dt, tilemap);
                break;
            case EnemyType.Manhandla:
                this.updateManhandla(dt, tilemap, projectiles, player);
                break;
            case EnemyType.Gleeok:
                this.updateGleeok(dt, projectiles, player);
                break;
            case EnemyType.Digdogger:
                this.updateDigdogger(dt, tilemap);
                break;
        }
    }

    private updateMoldorm(dt: number, tilemap: Tilemap) {
        // Moldorm: Move in curves
        // Simple implementation: Move forward, randomly turn slightly
        const moveAmt = this.speed * dt;

        // Update direction with sine wave or random
        this.moveTimer -= dt;
        if (this.moveTimer <= 0) {
            // Change curve direction
            this.moveTimer = 0.5 + Math.random();
            // Rotate direction vector
            const angle = Math.atan2(this.direction.y, this.direction.x);
            const newAngle = angle + (Math.random() - 0.5) * 2.0; // +/- 1 radian
            this.direction = { x: Math.cos(newAngle), y: Math.sin(newAngle) };
        }

        let nextX = this.x + this.direction.x * moveAmt;
        let nextY = this.y + this.direction.y * moveAmt;

        // Bounce off walls
        if (tilemap.isSolid(nextX + this.width / 2, nextY + this.height / 2)) {
            this.direction.x *= -1;
            this.direction.y *= -1;
            nextX = this.x + this.direction.x * moveAmt;
            nextY = this.y + this.direction.y * moveAmt;
        }

        this.x = nextX;
        this.y = nextY;
    }

    private updateManhandla(dt: number, tilemap: Tilemap, projectiles: Projectile[], player: Player) {
        // Manhandla: Move, Shoot Fireballs
        // Speed increases as health decreases (simulating limb loss)
        const speedMult = 1 + (16 - this.health) * 0.1;
        const originalSpeed = this.speed;
        this.speed = this.speed * speedMult;

        this.moveGridBased(dt, tilemap);
        this.speed = originalSpeed;

        if (Math.random() < 0.02) this.changeDirection();

        // Shoot
        if (Math.random() < 0.02) {
            this.shootFireballs(projectiles, player);
        }
    }

    private updateGleeok(dt: number, projectiles: Projectile[], player: Player) {
        // Gleeok: Static Body, Heads shoot
        // For MVP, just shoot fireballs at player
        this.moveTimer -= dt;
        if (this.moveTimer <= 0) {
            this.shootFireball(projectiles, player);
            this.moveTimer = 1.0 + Math.random();
        }
    }

    private updateDigdogger(dt: number, tilemap: Tilemap) {
        // Digdogger: Move around, Invincible (handled in takeDamage)
        this.moveGridBased(dt, tilemap);
        if (Math.random() < 0.02) this.changeDirection();
    }

    private updateGoriya(dt: number, tilemap: Tilemap, boomerangs: Boomerang[], player: Player) {
        // Goriya: Move -> Throw Boomerang -> Move
        if (this.state === EnemyState.Moving) {
            this.moveGridBased(dt, tilemap);
            if (Math.random() < 0.01) this.changeDirection();

            // Throw Boomerang
            const dx = Math.abs((this.x + this.width / 2) - (player.x + player.width / 2));
            const dy = Math.abs((this.y + this.height / 2) - (player.y + player.height / 2));
            const margin = 16;

            if ((dx < margin || dy < margin) && Math.random() < 0.02) {
                // Check if already has boomerang out?
                // For simplicity, allow one.
                const hasBoomerang = boomerangs.some(b => b.owner === this);
                if (!hasBoomerang) {
                    let bx = this.x + this.width / 2 - 4;
                    let by = this.y + this.height / 2 - 4;
                    let dir = { x: 0, y: 0 };

                    if (this.direction.y < 0) { dir.y = -1; by -= 8; }
                    else if (this.direction.y > 0) { dir.y = 1; by += 8; }
                    else if (this.direction.x < 0) { dir.x = -1; bx -= 8; }
                    else if (this.direction.x > 0) { dir.x = 1; bx += 8; }

                    if (dir.x !== 0 || dir.y !== 0) {
                        boomerangs.push(new Boomerang(bx, by, dir, this));
                        this.state = EnemyState.Attacking; // Pause while throwing?
                        this.moveTimer = 0.5;
                    }
                }
            }
        } else if (this.state === EnemyState.Attacking) {
            this.moveTimer -= dt;
            if (this.moveTimer <= 0) {
                this.state = EnemyState.Moving;
            }
        }
    }

    private updateLikeLike(dt: number, tilemap: Tilemap, player: Player) {
        // Like Like: Move towards player
        const moveAmt = this.speed * dt;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const len = Math.sqrt(dx * dx + dy * dy);

        if (len > 0) {
            const dirX = dx / len;
            const dirY = dy / len;

            // Try to move
            if (!tilemap.isSolid(this.x + dirX * moveAmt + this.width / 2, this.y + dirY * moveAmt + this.height / 2)) {
                this.x += dirX * moveAmt;
                this.y += dirY * moveAmt;
            }
        }
    }

    private updateGibdo(dt: number, tilemap: Tilemap) {
        // Gibdo: Same as Stalfos/Moblin (Random Grid)
        this.moveGridBased(dt, tilemap);
        if (Math.random() < 0.01) this.changeDirection();
    }

    private updateBubble(dt: number, tilemap: Tilemap) {
        // Bubble: Bounce diagonally
        const moveAmt = this.speed * dt;
        let nextX = this.x + this.direction.x * moveAmt;
        let nextY = this.y + this.direction.y * moveAmt;

        // Bounce X
        if (tilemap.isSolid(nextX + (this.direction.x > 0 ? this.width : 0), this.y + this.height / 2)) {
            this.direction.x *= -1;
            nextX = this.x + this.direction.x * moveAmt;
        }

        // Bounce Y
        if (tilemap.isSolid(nextX + this.width / 2, nextY + (this.direction.y > 0 ? this.height : 0))) {
            this.direction.y *= -1;
            nextY = this.y + this.direction.y * moveAmt;
        }

        this.x = nextX;
        this.y = nextY;

        // Ensure diagonal
        if (this.direction.x === 0) this.direction.x = 1;
        if (this.direction.y === 0) this.direction.y = 1;
    }

    private updateLeever(dt: number, tilemap: Tilemap, player: Player) {
        // Leever: Burrows (Idle) -> Surfaces (Moving) -> Burrows
        this.moveTimer -= dt;

        if (this.state === EnemyState.Idle) {
            // Buried
            if (this.moveTimer <= 0) {
                this.state = EnemyState.Moving; // Surface
                this.moveTimer = 2.0 + Math.random() * 2.0; // Stay up for 2-4s

                // Teleport near player?
                // For now, just appear where they are (or close)
                // In original, they spawn from ground near player.
                // We'll just toggle visibility/collision for now.
                // We'll just toggle visibility/collision for now.
            }
        } else {
            // Surfaced
            if (this.moveTimer <= 0) {
                this.state = EnemyState.Idle; // Burrow
                this.moveTimer = 2.0 + Math.random() * 2.0; // Stay down
            } else {
                // Move
                if (this.type === EnemyType.LeeverBlue) {
                    // Blue homes in
                    const dx = player.x - this.x;
                    const dy = player.y - this.y;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        this.direction = { x: dx > 0 ? 1 : -1, y: 0 };
                    } else {
                        this.direction = { x: 0, y: dy > 0 ? 1 : -1 };
                    }
                } else {
                    // Red moves randomly or straight
                    if (Math.random() < 0.05) this.changeDirection();
                }
                this.moveGridBased(dt, tilemap);
            }
        }
    }

    private updatePeahat(dt: number, _tilemap: Tilemap) {
        // Peahat: Fly (Invulnerable) -> Stop (Vulnerable)
        this.moveTimer -= dt;

        if (this.state === EnemyState.Flying) {
            // Flying logic
            const moveAmt = this.speed * dt;
            this.x += this.direction.x * moveAmt;
            this.y += this.direction.y * moveAmt;

            // Bounce off walls/edges
            if (this.x < 32 || this.x > 512 - 48) this.direction.x *= -1;
            if (this.y < 32 || this.y > 352 - 48) this.direction.y *= -1;

            if (this.moveTimer <= 0) {
                this.state = EnemyState.Idle; // Stop
                this.moveTimer = 1.0 + Math.random() * 2.0; // Rest
            }
        } else {
            // Stopped
            if (this.moveTimer <= 0) {
                this.state = EnemyState.Flying;
                this.moveTimer = 3.0 + Math.random() * 3.0; // Fly
                // Random diagonal direction
                const angle = Math.random() * Math.PI * 2;
                this.direction = { x: Math.cos(angle), y: Math.sin(angle) };
            }
        }
    }

    private updateLynel(dt: number, tilemap: Tilemap, projectiles: Projectile[], player: Player) {
        // Lynel: Moves like Moblin, shoots sword beams
        if (this.state === EnemyState.Moving) {
            this.moveGridBased(dt, tilemap);

            // Random direction change
            if (Math.random() < 0.01) {
                this.changeDirection();
            }

            // Shoot check
            // Align with player?
            const dx = Math.abs((this.x + this.width / 2) - (player.x + player.width / 2));
            const dy = Math.abs((this.y + this.height / 2) - (player.y + player.height / 2));
            const margin = 16;

            if ((dx < margin || dy < margin) && Math.random() < 0.02) {
                // Shoot sword beam
                this.shootMagic(projectiles, player); // Re-using magic for now (sword beam similar)
                this.state = EnemyState.Attacking;
                this.moveTimer = 0.5; // Attack pause
            }
        } else if (this.state === EnemyState.Attacking) {
            this.moveTimer -= dt;
            if (this.moveTimer <= 0) {
                this.state = EnemyState.Moving;
            }
        }
    }

    private updateZola(dt: number, projectiles: Projectile[], player: Player) {
        // Zola: Submerge -> Emerge -> Shoot -> Submerge
        this.moveTimer -= dt;

        if (this.state === EnemyState.Idle) {
            // Submerged
            if (this.moveTimer <= 0) {
                this.state = EnemyState.Attacking; // Emerge
                this.moveTimer = 2.0; // Stay up for 2s
                this.shootMagic(projectiles, player); // Shoot immediately on emerge
            }
        } else {
            // Emerged
            if (this.moveTimer <= 0) {
                this.state = EnemyState.Idle; // Submerge
                this.moveTimer = 2.0 + Math.random() * 3.0; // Stay down for 2-5s

                // Teleport to new random water spot? 
                // For now, just stay in place or maybe move slightly
            }
        }
    }

    private updateWallmaster(dt: number, _tilemap: Tilemap, player: Player) {
        // Wallmaster: Move towards player, grab if close
        const moveAmt = this.speed * dt;

        // Simple homing
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const len = Math.sqrt(dx * dx + dy * dy);

        if (len > 0) {
            this.x += (dx / len) * moveAmt;
            this.y += (dy / len) * moveAmt;
        }

        // Collision with player handled in Game.ts usually, but if we need special effect:
        // We can check here or let Game.ts handle damage.
        // Wallmaster sends player to start.
        // We'll leave damage to Game.ts for now, but maybe add a special flag?
        // Or check collision here.
        const pRect = player.getBounds();
        const eRect = { x: this.x, y: this.y, width: this.width, height: this.height };

        if (pRect.x < eRect.x + eRect.width &&
            pRect.x + pRect.width > eRect.x &&
            pRect.y < eRect.y + eRect.height &&
            pRect.y + pRect.height > eRect.y) {

            console.log('Caught by Wallmaster!');
            // Teleport player (hacky direct access or event?)
            // Player class doesn't have teleport method to specific room.
            // Game.ts handles this. We might need to just deal damage for now.
        }
    }

    private updatePolsVoice(dt: number, tilemap: Tilemap, player: Player) {
        // Pols Voice: Jump around randomly
        if (this.state === EnemyState.Jumping) {
            this.moveTimer -= dt;

            // Move in current direction
            const moveAmt = this.speed * dt;
            const nextX = this.x + this.direction.x * moveAmt;
            const nextY = this.y + this.direction.y * moveAmt;

            if (tilemap.isSolid(nextX + this.width / 2, nextY + this.height / 2)) {
                this.changeDirection();
            } else {
                this.x = nextX;
                this.y = nextY;
            }

            if (this.moveTimer <= 0) {
                this.state = EnemyState.Idle;
                this.moveTimer = 0.5 + Math.random() * 0.5;
            }
        } else {
            // Idle
            this.moveTimer -= dt;
            if (this.moveTimer <= 0) {
                this.state = EnemyState.Jumping;
                this.moveTimer = 1.0 + Math.random() * 1.0;
                this.changeDirection();
                // Jump towards player sometimes
                if (Math.random() < 0.5) {
                    const dx = player.x - this.x;
                    const dy = player.y - this.y;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        this.direction = { x: dx > 0 ? 1 : -1, y: 0 };
                    } else {
                        this.direction = { x: 0, y: dy > 0 ? 1 : -1 };
                    }
                }
            }
        }
    }

    private updateRope(dt: number, tilemap: Tilemap, player: Player) {
        // Rope: Moves randomly, but charges if aligned with player
        const margin = 16; // Alignment tolerance

        if (this.state === EnemyState.Attacking) {
            // Charging
            const moveAmt = 90 * dt; // Fast charge
            const nextX = this.x + this.direction.x * moveAmt;
            const nextY = this.y + this.direction.y * moveAmt;

            if (tilemap.isSolid(nextX + this.width / 2, nextY + this.height / 2)) {
                this.state = EnemyState.Moving;
                this.speed = 30;
                this.changeDirection();
            } else {
                this.x = nextX;
                this.y = nextY;
            }
        } else {
            // Normal movement
            this.moveGridBased(dt, tilemap);

            // Check alignment
            const dx = Math.abs((this.x + this.width / 2) - (player.x + player.width / 2));
            const dy = Math.abs((this.y + this.height / 2) - (player.y + player.height / 2));

            if (dx < margin) {
                // Aligned vertically
                this.state = EnemyState.Attacking;
                this.direction = { x: 0, y: player.y > this.y ? 1 : -1 };
            } else if (dy < margin) {
                // Aligned horizontally
                this.state = EnemyState.Attacking;
                this.direction = { x: player.x > this.x ? 1 : -1, y: 0 };
            } else if (Math.random() < 0.02) {
                this.changeDirection();
            }
        }
    }

    private updateArmos(dt: number, tilemap: Tilemap, player: Player) {
        if (this.state === EnemyState.Idle) {
            // Check for touch
            const pRect = player.getBounds();
            const eRect = { x: this.x, y: this.y, width: this.width, height: this.height };

            // Simple AABB collision
            if (pRect.x < eRect.x + eRect.width &&
                pRect.x + pRect.width > eRect.x &&
                pRect.y < eRect.y + eRect.height &&
                pRect.y + pRect.height > eRect.y) {

                this.state = EnemyState.Moving;
                this.speed = 60; // Fast
                console.log('Armos Activated!');
            }
        } else {
            this.moveGridBased(dt, tilemap);
            if (Math.random() < 0.05) {
                this.changeDirection();
            }
        }
    }

    private updateGhini(dt: number, player: Player) {
        // Ghini: Moves through walls towards player or randomly
        const moveAmt = this.speed * dt;

        // Simple homing or random
        if (Math.random() < 0.02) {
            // Change direction towards player or random
            if (Math.random() < 0.5) {
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                if (len > 0) {
                    this.direction = { x: dx / len, y: dy / len };
                }
            } else {
                const angle = Math.random() * Math.PI * 2;
                this.direction = { x: Math.cos(angle), y: Math.sin(angle) };
            }
        }

        this.x += this.direction.x * moveAmt;
        this.y += this.direction.y * moveAmt;

        // Keep in bounds (soft bounds)
        if (this.x < 32) this.direction.x = Math.abs(this.direction.x);
        if (this.x > 512 - 48) this.direction.x = -Math.abs(this.direction.x);
        if (this.y < 32) this.direction.y = Math.abs(this.direction.y);
        if (this.y > 352 - 48) this.direction.y = -Math.abs(this.direction.y);
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

        // Check Immunities
        let immune = false;
        if (weaponType === 'sword' && (this.immunityFlags & 1)) immune = true;
        if (weaponType === 'boomerang' && (this.immunityFlags & 2)) immune = true;
        if ((weaponType === 'arrow' || weaponType === 'silver-arrow') && (this.immunityFlags & 4)) immune = true;
        if (weaponType === 'bomb' && (this.immunityFlags & 8)) immune = true;

        if (immune) {
            return;
        }

        // Boomerang always stuns (no damage)
        if (weaponType === 'boomerang') {
            this.stunTimer = 2.0;
            console.log('Enemy Stunned by Boomerang!');
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

        // Pols Voice Vulnerability
        if (this.type === EnemyType.PolsVoice) {
            if (weaponType === 'arrow' || weaponType === 'silver-arrow') {
                this.health = 0; // One hit kill
                console.log('Pols Voice killed by arrow!');
            } else {
                return; // Immune to everything else (for now)
            }
        }

        // Peahat Vulnerability
        if (this.type === EnemyType.Peahat) {
            if (this.state === EnemyState.Flying) {
                return; // Invulnerable while flying
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
                ctx.globalAlpha = 1;
            }
        } else if (this.type === EnemyType.Rope) {
            ctx.filter = 'sepia(1) saturate(2) hue-rotate(45deg)'; // Brownish
        } else if (this.type === EnemyType.Armos) {
            if (this.state === EnemyState.Idle) {
                ctx.filter = 'grayscale(100%) brightness(0.8)'; // Stone
            } else {
                ctx.filter = 'grayscale(100%) brightness(1.2)'; // Active Stone
            }
        } else if (this.type === EnemyType.Ghini) {
            ctx.filter = 'opacity(0.7) hue-rotate(180deg) brightness(1.5)'; // Ghostly
        } else if (this.type === EnemyType.Zola) {
            ctx.filter = 'hue-rotate(90deg) saturate(2)'; // Greenish/Blue
        } else if (this.type === EnemyType.Wallmaster) {
            ctx.filter = 'hue-rotate(-45deg) saturate(2)'; // Reddish
        } else if (this.type === EnemyType.PolsVoice) {
            ctx.filter = 'hue-rotate(45deg) brightness(1.5)'; // Yellowish
        } else if (this.type === EnemyType.LeeverRed || this.type === EnemyType.LeeverBlue) {
            if (this.state === EnemyState.Idle) {
                ctx.globalAlpha = 0; // Buried
            } else {
                ctx.globalAlpha = 1;
            }
        } else if (this.type === EnemyType.Peahat) {
            if (this.state === EnemyState.Flying) {
                // Spin effect?
                // For now just normal
            }
        } else if (this.type === EnemyType.GoriyaRed) {
            ctx.filter = 'hue-rotate(-45deg) saturate(2)'; // Red
        } else if (this.type === EnemyType.GoriyaBlue) {
            ctx.filter = 'hue-rotate(180deg) saturate(2)'; // Blue
        } else if (this.type === EnemyType.LikeLike) {
            ctx.filter = 'hue-rotate(45deg) brightness(0.8) saturate(3)'; // Orange/Brown
        } else if (this.type === EnemyType.Gibdo) {
            ctx.filter = 'sepia(1) brightness(1.2)'; // Mummy
        } else if (this.type === EnemyType.Bubble) {
            // Flashing
            if (Math.floor(Date.now() / 100) % 2 === 0) {
                ctx.filter = 'invert(1)';
            } else {
                ctx.filter = 'none';
            }
        } else if (this.type === EnemyType.Moldorm) {
            ctx.filter = 'hue-rotate(60deg) saturate(3)'; // Yellow/Green
        } else if (this.type === EnemyType.Manhandla) {
            ctx.filter = 'hue-rotate(90deg) saturate(2)'; // Green
        } else if (this.type === EnemyType.Gleeok) {
            ctx.filter = 'hue-rotate(120deg) saturate(2)'; // Green
        } else if (this.type === EnemyType.Digdogger) {
            ctx.filter = 'hue-rotate(30deg) saturate(3)'; // Orange
        }

        this.sprite.draw(
            ctx,
            0, 0, 0, 0, // Frame args unused
            this.width,
            this.height,
            this,
            { x: camera.x, y: camera.y }
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
