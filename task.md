# Project Tasks

## Current Phase: Polish & Refinement

# Project Tasks

## Current Phase: Polish & Refinement

### ✅ Completed

- [x] **Core Engine:** Game loop, Input, Tilemap, Camera.
- [x] **Player:** Movement, Combat, Inventory, Stats.
- [x] **World:** Room loading, Collision, Doors, Secret Walls.
- [x] **Graphics:** Procedural sprites for Player, Enemies, Items.
- [x] **UI:** HUD, Title Screen, Game Over, Victory.
- [x] **Game Loop:** State management, Room transitions.
- [x] Create `NPCSprite` class with `draw` method
  - [x] Implement `drawOldMan`
  - [x] Implement `drawMerchant`
  - [x] Implement `drawZelda`
  - [x] Implement `drawMoblin` (Secret)
- [x] Update `ScreenData` interface in `OverworldData.ts` to include `npcType`
- [x] Assign `npcType` to relevant cave screens in `OverworldData`
- [x] Update `Game.ts` to pass `npcType` to `CaveScreen`
- [x] Update `CaveScreen.render` to use `NPCSprite`

### 🚧 In Progress / Next Steps

- [ ] **Audio:** Add sound effects (Sword, Bomb, Enemy Hit, Music).
- [ ] **Dungeons:** Implement separate dungeon maps/levels (currently all overworld).
- [ ] **Save/Load:** Persist game state to local storage.
- [ ] **NPCs:** Add Old Man/Merchant interactions (currently basic text).
- [x] Implement `Clock` in `ItemSprite.ts`
- [x] Create `FlameSprite` class and integrate into `CaveScreen`
- [x] Refactor `Projectile.ts` to remove legacy fallback rendering
- [x] Investigate/Add Particle Effect System (Explosions/Deaths)
- [x] Enhance Boss Sprites (Aquamentus, Dodongo, etc.)
- [ ] Verify NPC sprites in game
  - [ ] Start Screen Cave (Old Man)
  - [ ] Shop (Merchant)
  - [ ] Secret Cave (Moblin)

# Project Tasks

## Current Phase: Polish & Refinement

# Project Tasks

## Current Phase: Polish & Refinement

### ✅ Completed

- [x] **Core Engine:** Game loop, Input, Tilemap, Camera.
- [x] **Player:** Movement, Combat, Inventory, Stats.
- [x] **World:** Room loading, Collision, Doors, Secret Walls.
- [x] **Graphics:** Procedural sprites for Player, Enemies, Items.
- [x] **UI:** HUD, Title Screen, Game Over, Victory.
- [x] **Game Loop:** State management, Room transitions.
- [x] Create `NPCSprite` class with `draw` method
  - [x] Implement `drawOldMan`
  - [x] Implement `drawMerchant`
  - [x] Implement `drawZelda`
  - [x] Implement `drawMoblin` (Secret)
- [x] Update `ScreenData` interface in `OverworldData.ts` to include `npcType`
- [x] Assign `npcType` to relevant cave screens in `OverworldData`
- [x] Update `Game.ts` to pass `npcType` to `CaveScreen`
- [x] Update `CaveScreen.render` to use `NPCSprite`

### 🚧 In Progress / Next Steps

- [ ] **Audio:** Add sound effects (Sword, Bomb, Enemy Hit, Music).
- [ ] **Dungeons:** Implement separate dungeon maps/levels (currently all overworld).
- [ ] **Save/Load:** Persist game state to local storage.
- [ ] **NPCs:** Add Old Man/Merchant interactions (currently basic text).
- [x] Implement `Clock` in `ItemSprite.ts`
- [x] Create `FlameSprite` class and integrate into `CaveScreen`
- [x] Refactor `Projectile.ts` to remove legacy fallback rendering
- [x] Investigate/Add Particle Effect System (Explosions/Deaths)
- [x] Enhance Boss Sprites (Aquamentus, Dodongo, etc.)
- [ ] Verify NPC sprites in game
  - [ ] Start Screen Cave (Old Man)
  - [ ] Shop (Merchant)
  - [ ] Secret Cave (Moblin)

### 🔄 Sprite Migration

- [x] Generate Spritesheets (Tiles, Link, Enemies, Items)
- [x] Implement `ResourceManager` for asset loading
- [x] Refactor `Tilemap.ts` to use `tiles.png`
- [x] Refactor `Player.ts` to use `link.png`
- [x] Refactor `EnemySprite.ts` to use `enemies.png`
- [x] Refactor `ItemSprite.ts` to use `items.png`
- [x] Update `Player.ts` animation logic (Verified as done in previous steps)

### 🐛 Known Issues

- None currently known.
