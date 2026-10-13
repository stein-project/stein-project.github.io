---
title: "Stein GFX: new results"
date: 2026-10-05
summary: "The whole game is now drawn by Stein GFX, on OpenGL 4.6. In the 400-player crowd, about 5 times the FPS of current Stein."
tags: [stein-gfx]
---

Stein GFX has come a long way since the last post: **the whole game is now drawn by it**, including entities, terrain, particles, sky, the first-person hand and the interface. The game now runs on **OpenGL 4.6**, without the old pipeline.

## Results

Current Stein × Stein GFX, same machine, Fancy graphics:

- **Crowd** (400 players, mobs, chests and signs): **~98 → ~503 FPS**
- **Crowd with critical-hit sparks**: ~99 → **~542 FPS**
- **Crowd in the rain**: ~86 → **~458 FPS**
- **Crowd with fire and potions**: ~94 → **~432 FPS**
- **Cave with a crowd**: ~102 → **~568 FPS**
- **Particle storm**: ~579 → **~1,184 FPS**
- **Dense city**: ~1,560 → **~2,870 FPS**
- **Terrain loading**: ~2,220 → **~2,990 FPS**

In the crowd, FPS is about **5 times higher** than current Stein, and the **1% low** (the heaviest moments) went from ~62 to ~260.

**Compared to other clients**, in the same crowd scene:

- **OptiFine** (~50 FPS): about **+900%**, or 10 times the FPS.
- **Lunar + OptiFine** (~59 FPS, estimated): about **+750%**, or 8.5 times the FPS.

-# OptiFine 1.8.9 HD U L5 measured on 09/11/2026. The Lunar figure is estimated from a side-by-side test with Stein, in a 1280×720 window.

## What changed since the last post

- **Player poses on the GPU**: computing the poses moved from the CPU to the graphics card, with results identical to the game's.
- **Names and text kept on the GPU**: they are no longer rebuilt every frame.
- **One submission per frame**: each frame goes to the driver in a single submission.
- **Vulkan**: Vulkan support is written and passes its tests outside the game. The next step is running the game on it.

## Notes

- The measurements were taken on a single machine, in an 854×480 window:
  - **CPU**: AMD Ryzen 5 8600G
  - **Graphics card**: ASUS Radeon RX 7600 (8 GB)
  - **Memory**: 16 GB DDR5
- Tests on **Intel** and **NVIDIA** graphics cards and on Macs with **Apple Silicon** (M1, M2, M3 and later) are still to come.
- The image stays the same as the original game's, checked automatically.
- Stein GFX is still **in development** and is **not available** in current releases yet.
