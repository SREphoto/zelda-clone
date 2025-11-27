import { Loop } from './Loop';
import { Camera } from './Camera';
import { Tilemap } from './Tilemap';
import { Input } from './Input';
import { Player } from './Player';
import { Enemy, EnemyType } from './Enemy';
import { Projectile } from './Projectile';
import { Item, ItemType } from './Item';
import { Bomb, BombState } from './Bomb';
import { Arrow } from './Arrow';
import { HUD } from './HUD';
import { WorldMap } from './WorldMap';
import { Boomerang } from './Boomerang';
import { GameState, TitleScreen, GameOverScreen, VictoryScreen } from './GameState';
import { Door, SecretWall } from './Door';
import { OverworldData } from './data/OverworldData';

export class Game {
    private loop: Loop;
    private ctx: CanvasRenderingContext2D | null = null;
    private width: number = 0;
    private height: number = 0;
    private camera: Camera | null = null;
    private tilemap: Tilemap | null = null;
    private input: Input | null = null;
    private player: Player | null = null;
    private hud: HUD;

    private enemies: Enemy[] = [];
    private projectiles: Projectile[] = [];
    private items: Item[] = [];
    private bombs: Bomb[] = [];
    private arrows: Arrow[] = [];
    private boomerangs: Boomerang[] = [];

    // World Map
    private worldMap: WorldMap;
    private showingMap: boolean = false;

    // Forced Drop System Counters
    private tenCount: number = 0;
    private fairyCount: number = 0;
    private bombFlag: boolean = false;

    // Player Stats
    private rupees: number = 50;
    private bombAmmo: number = 4;

    // Game State Management
    private gameState: GameState = GameState.PLAYING;
    private titleScreen: TitleScreen;
    private gameOverScreen: GameOverScreen;
    private victoryScreen: VictoryScreen;

    // Doors and Secrets
    private doors: Door[] = [];
    private secretWalls: SecretWall[] = [];

    // Room Transition State
    private isTransitioning: boolean = false;
    private transitionProgress: number = 0;
    private transitionDir: { x: number, y: number } = { x: 0, y: 0 };
    private nextCameraPos: { x: number, y: number } = { x: 0, y: 0 };
    private static TRANSITION_SPEED = 500; // Pixels per second

    constructor() {
        this.loop = new Loop(this.update.bind(this), this.render.bind(this));
        this.hud = new HUD();
        this.worldMap = new WorldMap();
        this.titleScreen = new TitleScreen();
        this.gameOverScreen = new GameOverScreen();
        this.victoryScreen = new VictoryScreen();
    }

    public init(canvas: HTMLCanvasElement, onHealthChange: (health: number) => void) {
        this.ctx = canvas.getContext('2d');
        if (this.ctx) {
            this.ctx.imageSmoothingEnabled = false;
        }

        // Force resolution to match Room Size (16x11 tiles * 32px)
        this.width = 16 * 32;
        this.height = 11 * 32;

        // Canvas size includes HUD space
        canvas.width = this.width;
        canvas.height = this.height + 32;

        this.camera = new Camera(this.width, this.height);
        this.tilemap = new Tilemap(); // Load Overworld data
        this.input = new Input();

        // Start in Room 7,7 (Start Room)
        // 7 * 16 * 32 = 3584
        // 7 * 11 * 32 = 2464
        // Center of room: + (8*32, 5.5*32) = +256, +176
        const startRoomX = 7;
        const startRoomY = 7;
        this.camera.x = startRoomX * this.width;
        this.camera.y = startRoomY * this.height;

        this.player = new Player(this.camera.x + 256, this.camera.y + 240, onHealthChange);

        // Reset lists
        this.spawnEnemies();
        this.projectiles = [];
        this.items = [];
        this.bombs = [];
        this.arrows = [];
        console.log('Game Initialized', this.width, this.height);

        this.loop.start();
    }

    public destroy() {
        this.loop.stop();
        this.input?.destroy();
    }

    private update(dt: number) {
        if (!this.input) return;

        // Update Input state (for isPressed)
        this.input.update();

        // Handle Title Screen
        if (this.gameState === GameState.TITLE_SCREEN) {
            this.titleScreen.update(dt);
            if (this.input.isPressed('Space')) {
                this.gameState = GameState.PLAYING;
                console.log('Game Started!');
            }
            return;
        }

        // Handle Game Over
        if (this.gameState === GameState.GAME_OVER) {
            if (this.input.isPressed('Space')) {
                this.restartGame();
            } else if (this.input.isPressed('Escape')) {
                this.gameState = GameState.TITLE_SCREEN;
            }
            return;
        }

        // Handle Victory
        if (this.gameState === GameState.VICTORY) {
            if (this.input.isPressed('Space')) {
                this.restartGame();
            }
            return;
        }

        // Main game logic
        if (!this.player || !this.tilemap || !this.camera) return;

        // Check for player death
        if (this.player.health <= 0) {
            this.gameState = GameState.GAME_OVER;
            return;
        }

        // Toggle Map (M key)
        if (this.input.isPressed('KeyM')) {
            this.showingMap = !this.showingMap;
        }

        // If showing map, don't update game
        if (this.showingMap) {
            return;
        }

        if (this.isTransitioning) {
            this.updateTransition(dt);
            return;
        }

        this.player.update(dt, this.input, this.tilemap);

        // Check for Room Transition
        this.checkRoomTransition();
        this.checkDoors(dt);

        // Handle Bomb Input (Z key)
        if (this.input.isPressed('KeyZ')) {
            if (this.bombAmmo > 0) {
                const p = this.player;
                let bx = p.x + p.width / 2 - 8;
                let by = p.y + p.height / 2 - 8;

                if (p.direction === 'up') by -= 16;
                if (p.direction === 'down') by += 16;
                if (p.direction === 'left') bx -= 16;
                if (p.direction === 'right') bx += 16;

                this.bombs.push(new Bomb(bx, by));
                this.bombAmmo--;
                console.log('Bomb Placed! Ammo:', this.bombAmmo);
            } else {
                console.log('No Bombs!');
            }
        }

        // Handle Boomerang Input (B key)
        if (this.input.isPressed('KeyB')) {
            if (this.player.hasBoomerang && this.boomerangs.length === 0) {
                const p = this.player;
                let bx = p.x + p.width / 2 - 4;
                let by = p.y + p.height / 2 - 4;
                let dir = { x: 0, y: 0 };

                if (p.direction === 'up') { dir.y = -1; by -= 8; }
                else if (p.direction === 'down') { dir.y = 1; by += 8; }
                else if (p.direction === 'left') { dir.x = -1; bx -= 8; }
                else if (p.direction === 'right') { dir.x = 1; bx += 8; }

                this.boomerangs.push(new Boomerang(bx, by, dir));
                console.log('Boomerang Thrown!');
            }
        }

        // Handle Bow Input (X key)
        if (this.input.isPressed('KeyX')) {
            if (this.rupees > 0) {
                const p = this.player;
                let ax = p.x + p.width / 2;
                let ay = p.y + p.height / 2;
                let dir = { x: 0, y: 0 };

                if (p.direction === 'up') { ay -= 16; dir.y = -1; }
                if (p.direction === 'down') { ay += 16; dir.y = 1; }
                if (p.direction === 'left') { ax -= 16; dir.x = -1; }
                if (p.direction === 'right') { ax += 16; dir.x = 1; }

                if (dir.y !== 0) ax -= 2;
                if (dir.x !== 0) ay -= 2;

                this.arrows.push(new Arrow(ax, ay, dir, this.player.hasSilverArrows));
                this.rupees--;
                console.log('Arrow Fired! Rupees:', this.rupees);
            }
        }

        // Update Entities
        this.updateEntities(dt);
    }

    private checkRoomTransition() {
        if (!this.player || !this.camera) return;

        const p = this.player;
        const c = this.camera;

        let transition = false;
        let dir = { x: 0, y: 0 };

        // Check bounds relative to camera
        if (p.x < c.x) {
            dir = { x: -1, y: 0 };
            transition = true;
        } else if (p.y < c.y) {
            dir = { x: 0, y: -1 };
            transition = true;
        } else if (p.y + p.height > c.y + c.height) {
            dir = { x: 0, y: 1 };
            transition = true;
        }

        if (transition) {
            this.startTransition(dir);
        }
    }


    private checkDoors(dt: number) {
        const player = this.player;
        if (!player) return;

        this.doors.forEach(door => {
            door.update(dt);

            if (door.isLocked && !door.isOpen) {
                const pBounds = player.getBounds();
                const dBounds = door.getBounds();

                if (this.checkCollision(pBounds, dBounds)) {
                    if (player.keys > 0) {
                        player.keys--;
                        door.unlock();
                        console.log('Used Key! Keys left:', player.keys);
                    } else {
                        // Simple collision response: push back
                        const overlapX = (pBounds.x + pBounds.width / 2) - (dBounds.x + dBounds.width / 2);
                        const overlapY = (pBounds.y + pBounds.height / 2) - (dBounds.y + dBounds.height / 2);

                        if (Math.abs(overlapX) > Math.abs(overlapY)) {
                            player.x += overlapX > 0 ? 4 : -4;
                        } else {
                            player.y += overlapY > 0 ? 4 : -4;
                        }
                    }
                }
            }
        });
    }


    // Room Data Removed - Loaded from OverworldData

    private spawnEnemies() {
        if (!this.camera) return;
        const roomX = Math.floor(this.camera.x / this.width);
        const roomY = Math.floor(this.camera.y / this.height);
        const key = `${roomX},${roomY}`;

        this.enemies = [];
        this.items = [];
        this.doors = [];
        this.secretWalls = [];

        // Get screen data from OverworldData
        const screenData = OverworldData[key];

        if (!screenData) {
            console.warn(`No data for screen ${key}`);
            return;
        }

        // Spawn enemies
        if (screenData.enemies) {
            screenData.enemies.forEach(e => {
                // Coordinates in data are relative to the room
                const worldX = e.x + this.camera!.x;
                const worldY = e.y + this.camera!.y;
                this.enemies.push(new Enemy(worldX, worldY, e.type));
            });
        }

        // Spawn items
        if (screenData.items) {
            screenData.items.forEach(i => {
                const worldX = i.x + this.camera!.x;
                const worldY = i.y + this.camera!.y;
                this.items.push(new Item(worldX, worldY, i.type));
            });
        }

        // Spawn doors
        if (screenData.doors) {
            screenData.doors.forEach(d => {
                const worldX = d.x + this.camera!.x;
                const worldY = d.y + this.camera!.y;
                this.doors.push(new Door(worldX, worldY, d.direction, d.isLocked));
            });
        }

        // Spawn secret walls
        if (screenData.secretWalls) {
            screenData.secretWalls.forEach(s => {
                const worldX = s.x + this.camera!.x;
                const worldY = s.y + this.camera!.y;
                this.secretWalls.push(new SecretWall(worldX, worldY, s.requiresCandle));
            });
        }
    }


    private startTransition(dir: { x: number, y: number }) {
        if (!this.camera || !this.player) return;

        this.isTransitioning = true;
        this.transitionDir = dir;

        // Calculate next camera position
        this.nextCameraPos = {
            x: this.camera.x + (dir.x * this.width),
            y: this.camera.y + (dir.y * this.height)
        };
    }

    private updateTransition(dt: number) {
        if (!this.camera || !this.player) return;

        const speed = Game.TRANSITION_SPEED * dt;
        let finished = false;

        // Move Camera
        if (this.transitionDir.x !== 0) {
            this.camera.x += this.transitionDir.x * speed;
            if ((this.transitionDir.x > 0 && this.camera.x >= this.nextCameraPos.x) ||
                (this.transitionDir.x < 0 && this.camera.x <= this.nextCameraPos.x)) {
                this.camera.x = this.nextCameraPos.x;
                finished = true;
            }
        } else {
            this.camera.y += this.transitionDir.y * speed;
            if ((this.transitionDir.y > 0 && this.camera.y >= this.nextCameraPos.y) ||
                (this.transitionDir.y < 0 && this.camera.y <= this.nextCameraPos.y)) {
                this.camera.y = this.nextCameraPos.y;
                finished = true;
            }
        }

        // Move Player:
        // In Zelda 1, player moves about 2 tiles (64px) during the transition (256px camera move).
        // Ratio: 40 / 512 = ~0.08
        const playerSpeedRatio = 0.08;
        this.player.x += this.transitionDir.x * speed * playerSpeedRatio;
        this.player.y += this.transitionDir.y * speed * playerSpeedRatio;

        if (finished) {
            this.finishTransition();
        }
    }

    private finishTransition() {
        this.isTransitioning = false;

        // Ensure player is inside the new bounds
        if (!this.player || !this.camera) return;

        const margin = 4;
        if (this.transitionDir.x > 0) { // Moved Right
            this.player.x = this.camera.x + margin;
        } else if (this.transitionDir.x < 0) { // Moved Left
            this.player.x = this.camera.x + this.width - this.player.width - margin;
        } else if (this.transitionDir.y > 0) { // Moved Down
            this.player.y = this.camera.y + margin;
        } else if (this.transitionDir.y < 0) { // Moved Up
            this.player.y = this.camera.y + this.height - this.player.height - margin;
        }

        this.spawnEnemies();
        this.projectiles = []; // Clear projectiles on room change
        this.items = []; // Clear items? Maybe keep them? Zelda 1 clears them.

        // Update world map
        if (this.camera) {
            this.worldMap.updateCurrentRoom(this.camera, this.width, this.height);
        }
    }

    private updateEntities(dt: number) {
        if (!this.player || !this.tilemap) return;

        // Update Enemies
        this.enemies.forEach(enemy => {
            enemy.update(dt, this.tilemap!, this.projectiles, this.player!);
        });

        // Update Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.update(dt, this.tilemap!);

            if (proj.shouldRemove) {
                this.projectiles.splice(i, 1);
                continue;
            }

            if (this.checkCollision(proj.getBounds(), this.player)) {
                if (proj.isMagic && this.player.canBlockMagic(proj.direction)) {
                    console.log('Magic Blocked!');
                    this.projectiles.splice(i, 1);
                    continue;
                }
                this.player.takeDamage(proj.damage, proj.x, proj.y);
                this.projectiles.splice(i, 1);
                console.log('Player Hit by Projectile!');
            }
        }

        // Update Items
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.update(dt);

            if (item.shouldRemove) {
                this.items.splice(i, 1);
                continue;
            }

            if (this.checkCollision(item.getBounds(), this.player)) {
                this.collectItem(item);
                this.items.splice(i, 1);
            }
        }

        // Update Bombs
        for (let i = this.bombs.length - 1; i >= 0; i--) {
            const bomb = this.bombs[i];
            bomb.update(dt);

            if (bomb.state === BombState.Done) {
                this.bombs.splice(i, 1);
                continue;
            }

            if (bomb.state === BombState.Exploding) {
                const blastRect = bomb.getBounds();
                this.enemies.forEach(enemy => {
                    if (this.checkCollision(blastRect, enemy)) {
                        const dx = (enemy.x + enemy.width / 2) - (bomb.x + bomb.width / 2);
                        const dy = (enemy.y + enemy.height / 2) - (bomb.y + bomb.height / 2);
                        const len = Math.sqrt(dx * dx + dy * dy);
                        const dir = len > 0 ? { x: dx / len, y: dy / len } : { x: 1, y: 0 };
                        enemy.takeDamage(bomb.damage, dir, 'bomb');
                    }
                });
                if (this.checkCollision(blastRect, this.player)) {
                    this.player.takeDamage(1, bomb.x + bomb.width / 2, bomb.y + bomb.height / 2);
                }
            }
        }

        // Update Arrows
        for (let i = this.arrows.length - 1; i >= 0; i--) {
            const arrow = this.arrows[i];
            arrow.update(dt);

            if (arrow.x < this.camera!.x || arrow.x > this.camera!.x + this.width ||
                arrow.y < this.camera!.y || arrow.y > this.camera!.y + this.height) {
                this.arrows.splice(i, 1);
                continue;
            }

            let hit = false;
            for (const enemy of this.enemies) {
                if (this.checkCollision(arrow.getBounds(), enemy)) {
                    const type = arrow.isSilver ? 'silver-arrow' : 'arrow';
                    enemy.takeDamage(arrow.damage, arrow.direction, type);
                    hit = true;
                    break;
                }
            }
            if (hit) {
                this.arrows.splice(i, 1);
            }
        }

        // Update Boomerangs
        for (let i = this.boomerangs.length - 1; i >= 0; i--) {
            const boomerang = this.boomerangs[i];
            boomerang.update(dt, this.player);

            if (boomerang.shouldRemove) {
                this.boomerangs.splice(i, 1);
                continue;
            }

            // Check boomerang-enemy collision (stun)
            for (const enemy of this.enemies) {
                if (this.checkCollision(boomerang.getBounds(), enemy)) {
                    const dx = enemy.x - boomerang.x;
                    const dy = enemy.y - boomerang.y;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const dir = len > 0 ? { x: dx / len, y: dy / len } : { x: 1, y: 0 };
                    enemy.takeDamage(0, dir, 'boomerang'); // 0 damage = stun only
                }
            }
        }

        // Check Combat Collision
        if (this.player.isAttacking) {
            const swordHitbox = this.getSwordHitbox();
            if (swordHitbox) {
                for (let i = this.enemies.length - 1; i >= 0; i--) {
                    const enemy = this.enemies[i];
                    if (this.checkCollision(swordHitbox, enemy)) {
                        const dx = enemy.x - this.player.x;
                        const dy = enemy.y - this.player.y;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const dir = length > 0 ? { x: dx / length, y: dy / length } : { x: 1, y: 0 };
                        enemy.takeDamage(1, dir, 'sword');
                        if (enemy.health <= 0) {
                            this.handleEnemyDeath(enemy);
                            this.enemies.splice(i, 1);
                            console.log('Enemy Defeated!');
                        }
                    }
                }
            }
        }

        // Check Player Damage
        if (this.player.health > 0) {
            for (const enemy of this.enemies) {
                if (this.checkCollision(this.player, enemy)) {
                    this.player.takeDamage(0.5, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                    this.tenCount = 0;
                    this.bombFlag = false;
                    this.fairyCount = 0;
                }
            }
        } else {
            console.log('Game Over! Restarting...');
            this.player.health = 3;
            // Reset to start of current room? Or start of game?
            // For now, start of game
            this.init(this.ctx!.canvas, (_h) => { });
        }
    }

    private collectItem(item: Item) {
        if (!this.player) return;

        switch (item.type) {
            case ItemType.Heart:
                this.player.health = Math.min(this.player.health + 1, this.player.maxHealth);
                console.log('Collected Heart');
                break;
            case ItemType.HeartContainer:
                this.player.heartContainers++;
                this.player.maxHealth = this.player.heartContainers;
                this.player.health = this.player.maxHealth; // Fully heal
                console.log('Collected Heart Container! Max Health:', this.player.maxHealth);
                break;
            case ItemType.RupeeGreen:
                this.rupees += 1;
                console.log('Collected Rupee (Total: ' + this.rupees + ')');
                break;
            case ItemType.FiveRupee:
                this.rupees += 5;
                console.log('Collected 5 Rupees (Total: ' + this.rupees + ')');
                break;
            case ItemType.Fairy:
                this.player.health = this.player.maxHealth; // Fully restore
                console.log('Collected Fairy - Fully healed!');
                break;
            case ItemType.Bomb:
                this.bombAmmo += 4;
                console.log('Collected Bombs (Total: ' + this.bombAmmo + ')');
                break;
            case ItemType.MagicalShield:
                this.player.hasMagicalShield = true;
                this.player.shieldLevel = 2;
                console.log('Collected Magical Shield!');
                break;
            case ItemType.SilverArrow:
                this.player.hasSilverArrows = true;
                console.log('Collected Silver Arrows!');
                break;
            case ItemType.Boomerang:
                this.player.hasBoomerang = true;
                console.log('Collected Boomerang!');
                break;
            case ItemType.Compass:
                this.player.hasCompass = true;
                console.log('Collected Compass!');
                break;
            case ItemType.Map:
                this.player.hasMap = true;
                console.log('Collected Dungeon Map!');
                break;
            case ItemType.Key:
                this.player.keys++;
                console.log('Collected Key! Total keys:', this.player.keys);
                break;
            case ItemType.Candle:
                this.player.hasCandle = true;
                console.log('Collected Candle!');
                break;
            case ItemType.Ladder:
                this.player.hasLadder = true;
                console.log('Collected Ladder!');
                break;
            case ItemType.MagicRod:
                this.player.hasMagicRod = true;
                console.log('Collected Magic Rod!');
                break;
            case ItemType.BlueRing:
                this.player.defenseRing = 1;
                console.log('Collected Blue Ring! (Defense +25%)');
                break;
            case ItemType.RedRing:
                this.player.defenseRing = 2;
                console.log('Collected Red Ring! (Defense +50%)');
                break;
            case ItemType.Triforce:
                console.log('YOU WIN!');
                this.gameState = GameState.VICTORY;
                break;
        }
    }

    private getSwordHitbox() {
        if (!this.player) return null;
        const p = this.player;
        const screenX = p.x;
        const screenY = p.y;

        let swordX = screenX + p.width / 2;
        let swordY = screenY + p.height / 2;
        let swordW = 20;
        let swordH = 20;

        if (p.direction === 'down') { swordY += 20; swordW = 10; swordH = 30; }
        if (p.direction === 'up') { swordY -= 30; swordW = 10; swordH = 30; }
        if (p.direction === 'left') { swordX -= 30; swordW = 30; swordH = 10; }
        if (p.direction === 'right') { swordX += 20; swordW = 30; swordH = 10; }

        return { x: swordX, y: swordY, width: swordW, height: swordH };
    }

    private checkCollision(rect1: { x: number, y: number, width: number, height: number }, rect2: { x: number, y: number, width: number, height: number }) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    private handleEnemyDeath(enemy: Enemy) {
        // Zol Splitting Logic
        if (enemy.type === EnemyType.Zol) {
            console.log('Zol Split!');
            // Spawn 2 Gels
            const gel1 = new Enemy(enemy.x - 8, enemy.y, EnemyType.Gel);
            const gel2 = new Enemy(enemy.x + 8, enemy.y, EnemyType.Gel);
            this.enemies.push(gel1, gel2);
            return; // No item drop from splitting Zol
        }

        // Ganon Logic
        if (enemy.type === EnemyType.Ganon) {
            console.log('Ganon Defeated!');
            this.items.push(new Item(enemy.x, enemy.y, ItemType.Triforce));
            return;
        }

        this.tenCount++;
        this.fairyCount++;

        let dropType: ItemType | null = null;

        if (this.fairyCount === 16) {
            dropType = ItemType.Fairy;
            this.tenCount = 0;
            this.bombFlag = false;
        }
        else if (this.tenCount >= 10) {
            if (this.bombFlag) {
                dropType = ItemType.Bomb;
            } else {
                dropType = ItemType.FiveRupee;
            }
            this.tenCount = 0;
            this.bombFlag = false;
        }

        if (!dropType) {
            const rand = Math.random();
            if (rand < 0.05) dropType = ItemType.Heart;
            else if (rand < 0.15) dropType = ItemType.RupeeGreen;
        }

        if (dropType !== null) {
            this.items.push(new Item(enemy.x + 4, enemy.y + 4, dropType));
            // Find key for logging
            const typeName = Object.keys(ItemType).find(key => ItemType[key as keyof typeof ItemType] === dropType);
            console.log(`Spawned Item: ${typeName}`);
        }
    }

    private render() {
        if (!this.ctx || !this.camera || !this.tilemap || !this.player) return;

        // Clear Screen
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Render HUD
        this.hud.render(this.ctx, this.player, this.rupees, this.bombAmmo);

        // Render Game World (Shifted down)
        this.ctx.save();
        this.ctx.translate(0, 32);

        // Clip to game area to prevent drawing over HUD if camera moves weirdly
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.clip();

        this.tilemap.render(this.ctx, this.camera);

        this.doors.forEach(door => {
            if (this.ctx && this.camera) {
                door.render(this.ctx, this.camera);
            }
        });

        this.secretWalls.forEach(wall => {
            if (this.ctx && this.camera && wall.isRevealed) {
                wall.render(this.ctx, this.camera);
            }
        });

        this.bombs.forEach(bomb => {
            if (this.ctx && this.camera) {
                bomb.render(this.ctx, this.camera);
            }
        });

        this.items.forEach(item => {
            if (this.ctx && this.camera) {
                item.render(this.ctx, this.camera);
            }
        });

        this.enemies.forEach(enemy => {
            if (this.ctx && this.camera) {
                enemy.render(this.ctx, this.camera);
            }
        });

        this.projectiles.forEach(proj => {
            if (this.ctx && this.camera) {
                proj.render(this.ctx, this.camera);
            }
        });

        this.arrows.forEach(arrow => {
            if (this.ctx && this.camera) {
                arrow.render(this.ctx, this.camera);
            }
        });

        this.boomerangs.forEach(boomerang => {
            if (this.ctx && this.camera) {
                boomerang.render(this.ctx, this.camera);
            }
        });

        this.player.render(this.ctx, this.camera);

        this.ctx.restore();

        // Render World Map overlay if showing
        if (this.showingMap) {
            this.worldMap.render(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height);
        }

        // Render Game State Overlays
        if (this.gameState === GameState.TITLE_SCREEN) {
            this.titleScreen.render(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height);
        } else if (this.gameState === GameState.GAME_OVER) {
            this.gameOverScreen.render(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height);
        } else if (this.gameState === GameState.VICTORY) {
            this.victoryScreen.render(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height);
        }
    }

    private restartGame() {
        if (!this.ctx) return;
        this.gameState = GameState.PLAYING;
        this.init(this.ctx.canvas, (_h) => { });
        console.log('Game Restarted!');
    }
}
