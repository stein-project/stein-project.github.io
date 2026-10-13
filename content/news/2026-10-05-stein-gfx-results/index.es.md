---
title: "Stein GFX: nuevos resultados"
date: 2026-10-05
summary: "Ahora todo el juego lo dibuja Stein GFX, en OpenGL 4.6. En la multitud de 400 jugadores, cerca de 5 veces los FPS del Stein actual."
tags: [stein-gfx]
---

Desde la última novedad, Stein GFX avanzó mucho: ahora **todo el juego lo dibuja él**, incluidas las entidades, el terreno, las partículas, el cielo, la mano en primera persona y la interfaz. El juego pasa a funcionar en **OpenGL 4.6**, sin el pipeline antiguo.

## Resultados

Stein actual × Stein GFX, misma máquina, gráficos en Fancy:

- **Multitud** (400 jugadores, mobs, cofres y carteles): **~98 → ~503 FPS**
- **Multitud con chispas de crítico**: ~99 → **~542 FPS**
- **Multitud bajo la lluvia**: ~86 → **~458 FPS**
- **Multitud con fuego y pociones**: ~94 → **~432 FPS**
- **Cueva con multitud**: ~102 → **~568 FPS**
- **Tormenta de partículas**: ~579 → **~1.184 FPS**
- **Ciudad densa**: ~1.560 → **~2.870 FPS**
- **Terreno cargando**: ~2.220 → **~2.990 FPS**

En la multitud, los FPS son cerca de **5 veces mayores** que los del Stein actual, y el **1% low** (los momentos más pesados) subió de ~62 a ~260.

**Frente a otros clientes**, en la misma escena de la multitud:

- **OptiFine** (~50 FPS): cerca de **+900%**, o 10 veces más FPS.
- **Lunar + OptiFine** (~59 FPS, estimado): cerca de **+750%**, o 8,5 veces más FPS.

-# OptiFine 1.8.9 HD U L5 medido el 11/09/2026. El valor de Lunar se estima a partir de una prueba lado a lado con Stein, en una ventana de 1280×720.

## Qué cambió desde la última novedad

- **Posiciones de los jugadores en la tarjeta gráfica**: el cálculo de las poses pasó del procesador a la tarjeta, con un resultado idéntico al del juego.
- **Nombres y textos guardados en la tarjeta gráfica**: ya no se arman en cada imagen.
- **Una entrega por imagen**: cada imagen se envía al driver de una sola vez.
- **Vulkan**: el soporte de Vulkan ya está escrito y pasa las pruebas fuera del juego. El siguiente paso es que el juego funcione sobre él.

## Observaciones

- Las mediciones se hicieron en una sola máquina, con una ventana de 854×480:
  - **Procesador**: AMD Ryzen 5 8600G
  - **Tarjeta gráfica**: ASUS Radeon RX 7600 (8 GB)
  - **Memoria**: 16 GB DDR5
- Todavía se harán pruebas con tarjetas gráficas **Intel** y **NVIDIA** y en Macs con **Apple Silicon** (chips M1, M2, M3 y posteriores).
- La imagen sigue siendo la del juego original, comprobada automáticamente.
- Stein GFX sigue **en desarrollo** y aún **no está disponible** en las versiones actuales.
