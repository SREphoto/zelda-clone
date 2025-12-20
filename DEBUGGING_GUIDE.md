# 🔧 Zelda Clone - Diagnostic Guide

## How to Debug the Game

### Step 1: Open Browser Console

1. Go to `http://localhost:3012/`
2. Press **F12** to open Developer Tools
3. Click the **Console** tab

### Step 2: Check Initialization Messages

You should see these messages **IN ORDER**:

```
✅ Input system initialized - listening for keys
🎮 Game Loop STARTED
Game Initialized 512 352
All assets loaded
```

**If you DON'T see these:**

- There's a JavaScript error preventing the game from starting
- Check for RED error messages in the console
- Report the error message

### Step 3: Check Game Loop

Every second, you should see:

```
🔄 Game loop running - Frame 60, dt: 0.016s
🔄 Game loop running - Frame 120, dt: 0.016s
```

**If you DON'T see these:**

- The game loop isn't running
- Check if there's an error in the console

### Step 4: Test Keyboard Input

1. **Click on the game canvas** (you should see a GOLD outline)
2. **Press W** or **Arrow Up**

You should see:

```
🔑 KEY DOWN: KeyW Keys object: {}
⚠️ Prevented default for: KeyW
✅ Key registered: KeyW Current keys: ['KeyW']
📍 isDown(KeyW) = TRUE
👤 Player.update() called
🚶 Player MOVING! Direction: up dx: 0 dy: -1
```

**If you see key messages but NO movement:**

- Input is working but player isn't updating
- Check for errors between input and player

**If you see NO key messages:**

- Input system isn't capturing keys
- Canvas might not have focus
- Try clicking the canvas again

### Step 5: Test Attack

1. **Press SPACE**

You should see:

```
🎯 isPressed(Space) = TRUE
ATTACK TRIGGERED! Sword level: 1 Direction: down
Drawing sword! Direction: down ScreenPos: X Y
```

**AND** you should see a **CYAN rectangle** with a **BRIGHT RED sword** on screen!

## Visual Indicators

### Canvas Outline Colors

- **🟡 GOLD** = Canvas is focused, controls will work
- **⚫ GRAY** = Canvas lost focus, click it to refocus

### On-Screen Messages

- **"CLICK THE GAME TO PLAY"** = Canvas not focused, click it!
- **"PRESS SPACE TO START"** = Title screen (blinking)

## Common Issues

### "I see no console messages"

**Problem:** Game didn't initialize
**Solution:** Check for compilation errors in the terminal running `npm run dev`

### "I see game loop messages but no key messages"

**Problem:** Input system isn't capturing keys
**Solution:**

1. Click directly on the game canvas
2. Make sure canvas has gold outline
3. Check if there are JavaScript errors

### "I see key messages but Link doesn't move"

**Problem:** Player update isn't being called or movement is blocked
**Solution:**

1. Check for `👤 Player.update() called` messages
2. Check for `🚶 Player MOVING!` messages
3. If you see update but not moving, input isn't reaching player

### "I see everything but still can't move"

**Problem:** Collision or tilemap issue
**Solution:** Report this - it's a logic bug

## What to Report

When reporting issues, include:

1. **All console messages** (copy/paste the entire console)
2. **What you tried** (which keys, what happened)
3. **Visual state** (outline color, what you see on screen)
4. **Any red errors** in the console

## Controls Quick Reference

- **WASD** or **Arrow Keys** - Move Link
- **SPACE** - Attack
- **Z** - Place Bomb
- **X** - Shoot Arrow
- **B** - Boomerang  
- **M** - Map

**IMPORTANT:** You MUST click the canvas first before controls work!
