---
title: "Stein GFX ahora es la API gráfica principal de Stein"
date: 2026-10-12
summary: "Stein GFX ya es la API gráfica por defecto de Stein Loader y Stein Client. Y el código de Stein va a ser abierto."
tags: [stein-gfx]
---

**Stein GFX** ya es la API gráfica por defecto de **Stein Loader** y **Stein Client**. Algunos jugadores informaron **hasta el doble de FPS** en escenarios de estrés, una mejora notable frente a la versión anterior.

## Compatibilidad

Stein GFX trae grandes cambios en la forma en que se dibuja el juego. Por eso, **los mods que usan directamente la API gráfica antigua del juego no funcionan** con él.

Si lo necesitas, puedes desactivarlo:

- **Stein Client**: en **Ajustes**, desactiva la opción **Stein GFX**. El cambio se aplica la próxima vez que se abra el juego.
- **Instalador**: añade `-Dsteinbridge.gfx=false` a los argumentos de Java del perfil.

## Stein Lens

**Stein Lens**, el conjunto de efectos visuales conocidos como "shaders" (sombras, agua, plantas al viento y otros), fue **descontinuado** en esta versión. Será **rehecho desde cero sobre Stein GFX**.

## Problemas conocidos

- Fallos de **iluminación** y **oscurecimiento de la pantalla**.
- Inestabilidad del rendimiento en el **1% low** (los momentos más pesados).

Los problemas ya están identificados y las correcciones están en marcha.

## Próximos pasos

Entró en el backlog del proyecto:

- **Connect**: inicio de sesión automático en servidores que exigen un comando de login en el chat.

## Código abierto

El código fuente de **Stein Bridge**, **Stein Loader** y los **mods oficiales** será abierto bajo la licencia **MPL 2.0**: cualquiera podrá estudiarlo, modificarlo y contribuir, siempre que los cambios en los archivos del proyecto también sigan abiertos.

Eso incluye **Stein Bridge**, responsable de las optimizaciones, la modernización del juego y Stein GFX.

Quien quiera contribuir encontrará el código en [github.com/stein-project](https://github.com/stein-project).
