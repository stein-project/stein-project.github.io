---
title: "Stein GFX is now Stein's main graphics API"
date: 2026-10-12
summary: "Stein GFX is out as the default graphics API of Stein Loader and Stein Client. And Stein's code is going open source."
tags: [stein-gfx]
---

**Stein GFX** is out as the default graphics API of **Stein Loader** and **Stein Client**. Some players reported **up to twice the FPS** in stress scenarios, a big gain over the previous version.

## Compatibility

Stein GFX brings big changes to how the game is drawn. Because of that, **mods that use the game's old graphics API directly don't work** with it.

If you need to, you can turn it off:

- **Stein Client**: in **Settings**, turn off the **Stein GFX** option. The change applies the next time the game opens.
- **Installer**: add `-Dsteinbridge.gfx=false` to the profile's Java arguments.

## Stein Lens

**Stein Lens**, the set of visual effects known as "shaders" (shadows, water, plants in the wind and more), was **discontinued** in this version. It will be **rebuilt from scratch on top of Stein GFX**.

## Known issues

- **Lighting** glitches and **the screen getting darker**.
- Unstable performance in the **1% low** (the heaviest moments).

The issues have been identified and the fixes are under way.

## Next steps

Added to the project backlog:

- **Connect**: automatic sign-in on servers that require a login command in the chat.

## Open source

The source code of **Stein Bridge**, **Stein Loader** and the **official mods** will be opened under the **MPL 2.0** license: anyone will be able to study, modify and contribute, as long as changes to the project's files also stay open.

That includes **Stein Bridge**, which is responsible for the optimizations, the game's modernization and Stein GFX.

Anyone interested in contributing will find the code at [github.com/stein-project](https://github.com/stein-project).
