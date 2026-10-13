---
title: "In development: Stein GFX"
date: 2026-10-03
summary: "Stein's new graphics API batches the game's requests and sends them to the GPU all at once: from 1,100 requests per frame down to 3."
tags: [stein-gfx]
---

Every image on screen is built by two parts of the computer: the **CPU**, which runs the game, and the **graphics card**, which paints the image. **Stein GFX**, Stein's new graphics API, changes the conversation between the two.

## What it is

Minecraft 1.8.9 uses **fixed-function OpenGL**, the old way of talking to the graphics card: the game dictates every step, one at a time, and the driver checks each request before moving on. With 400 players on screen, that is about **1,100 requests** and **4,100 texture switches** per frame, almost all of it on a single CPU core.

**Stein GFX** is Stein's new graphics API. It sits between the game and the graphics card: it receives the same requests the game makes, but instead of sending them one by one, it **organizes everything and sends it all at once**, through modern OpenGL and, in the future, Vulkan.

**Today, on Minecraft 1.8.9:**

1. **The game** sends its requests **one at a time**.
2. **Fixed-function OpenGL** passes each one along.
3. The **graphics card** receives about **1,100 requests** per frame.

**With Stein GFX:**

1. **The game** makes the same requests as always.
2. **Stein GFX** organizes everything and sends it **all together**.
3. **Modern OpenGL** (and, soon, **Vulkan**) takes only **3 requests** per frame to the **graphics card**.

## How it works

- **Record, don't wait**: the game's requests are recorded instead of being sent right away.
- **3 draws per frame**: all the bodies, then all the armor, then everything else.
- **Textures kept on the GPU**: skins stay stored on the graphics card, with no switching on every draw.
- **Multiple CPU cores**: player positions are computed in parallel.
- **Its own shaders**: light, color and shading are computed directly on the graphics card.

> **What is a shader?** A small program run by the graphics card that computes the color of each part of the image. Every modern game uses shaders to draw anything on screen. In Stein GFX, they only **reproduce the original 1.8.9 look**: these are not OptiFine "shaders", which change how the game looks.

**Today, on Minecraft 1.8.9**, fixed-function OpenGL only knows how to follow ready-made recipes, and the game dictates **every step, one at a time**:

- **On the CPU**, the game repeats for every part of each of the 400 players: use the skin, rotate the arm, turn on the light, draw the arm, use the armor, draw the armor.
- **In OpenGL**, that becomes a queue of "switch texture, draw, switch texture, draw", about **1,100 times**.
- **The graphics card** waits for each request before moving on: **~1,100 draws per frame**.

**With Stein GFX**, the game's requests are **recorded** and sent **all at once**:

- **On the CPU**, the game keeps the same logic (use the skin, rotate the arm, draw), but each request is recorded, without waiting.
- **Stein GFX** organizes what was recorded into lists: **all the bodies**, **all the armor** and **everything else**.
- **Modern OpenGL** (and, later, Vulkan) hands those lists to the card in **3 draws**.
- **The graphics card** computes the image with **Stein's shaders**: **3 draws per frame**.

## Gains so far

Measured in a scene with 400 players, mobs, chests and signs:

- **~98 → ~210 FPS** compared to current Stein.
- **1,100 → 3** requests to the graphics card per frame.
- **7.6 → 3.8 ms** of GPU work per frame.

The image, the physics and the PvP stay exactly as in the original game. Player animations, now computed by Stein, were checked and are identical to the game's.

![FPS chart: Vanilla, OptiFine, Lunar + OptiFine, Stein and Stein GFX](fps-chart.png)

## Next steps

Stein GFX is still in development and is **not available** in current releases. It will only become the default once it is equal to or better than current Stein in every tested scenario.

### macOS

Apple deprecated OpenGL in 2018: it stopped at version 4.1 and, on the latest macOS versions, no longer even has its own driver. Every request the game makes is translated to **Metal**, Apple's graphics API, by an old, unmaintained layer. Because of that limit, Stein's optional visual effects (such as shadows and water) don't work on Mac today.

Stein GFX changes this in two steps:

- **Modern OpenGL 4.1**: Stein GFX already has a mode within the Mac's limit, which will let the optional visual effects work on macOS too.
- **Vulkan, later on**: on Mac, Vulkan runs on top of Metal through **MoltenVK**, an actively maintained layer, instead of the legacy OpenGL translation.

With that, Stein GFX is the path to full macOS support.

### Compatibility

Stein is **modular**: you will be able to **turn Stein GFX off at startup**.

This is needed because some mods used with Stein today depend entirely on old OpenGL and will have to be adapted by their developers to work with Stein GFX. Meanwhile, the current mode, with every optimization Stein already offers, remains available.

At some point in the future, still **with no set date**, Stein GFX will become the default, and the old mode will become a **secondary layer** with more limited support.
