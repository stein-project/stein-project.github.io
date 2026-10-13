---
title: "Stein GFX: novos resultados"
date: 2026-10-05
summary: "O jogo inteiro agora é desenhado pelo Stein GFX, em OpenGL 4.6. Na multidão de 400 jogadores, cerca de 5 vezes mais FPS que o Stein atual."
tags: [stein-gfx]
---

Desde o último anúncio, o Stein GFX avançou bastante: agora **o jogo inteiro é desenhado por ele**, incluindo entidades, terreno, partículas, céu, mão em primeira pessoa e interface. O jogo passa a rodar em **OpenGL 4.6**, sem o pipeline antigo.

## Resultados

Stein atual × Stein GFX, mesma máquina, gráficos em Fancy:

- **Multidão** (400 jogadores, mobs, baús e placas): **~98 → ~503 FPS**
- **Multidão com faíscas de crítico**: ~99 → **~542 FPS**
- **Multidão na chuva**: ~86 → **~458 FPS**
- **Multidão com fogo e poção**: ~94 → **~432 FPS**
- **Caverna com multidão**: ~102 → **~568 FPS**
- **Tempestade de partículas**: ~579 → **~1.184 FPS**
- **Cidade densa**: ~1.560 → **~2.870 FPS**
- **Terreno carregando**: ~2.220 → **~2.990 FPS**

Na multidão, o FPS ficou cerca de **5 vezes maior** que o do Stein atual, e o **1% low** (os momentos mais pesados) subiu de ~62 para ~260.

**Em relação a outros clientes**, na mesma cena da multidão:

- **OptiFine** (~50 FPS): cerca de **+900%**, ou 10 vezes mais FPS.
- **Lunar + OptiFine** (~59 FPS, estimado): cerca de **+750%**, ou 8,5 vezes mais FPS.

-# OptiFine 1.8.9 HD U L5 medido em 11/09/2026. O valor do Lunar é estimado a partir de um teste lado a lado com o Stein, em janela de 1280×720.

## O que mudou desde o último anúncio

- **Posições dos jogadores na placa de vídeo**: o cálculo das poses saiu do processador e passou para a placa, com resultado idêntico ao do jogo.
- **Nomes e textos guardados na placa de vídeo**: deixam de ser montados a cada imagem.
- **Uma entrega por imagem**: cada imagem é enviada ao driver de uma única vez.
- **Vulkan**: o suporte ao Vulkan já foi escrito e passa nos testes fora do jogo. O próximo passo é o jogo rodar sobre ele.

## Observações

- As medições foram feitas em uma única máquina, com janela de 854×480:
  - **Processador**: AMD Ryzen 5 8600G
  - **Placa de vídeo**: ASUS Radeon RX 7600 (8 GB)
  - **Memória**: 16 GB DDR5
- Ainda serão realizados testes com placas de vídeo **Intel** e **NVIDIA** e em Macs com **Apple Silicon** (chips M1, M2, M3 e posteriores).
- A imagem permanece a mesma do jogo original, conferida automaticamente.
- O Stein GFX continua **em desenvolvimento** e ainda **não está disponível** nas versões atuais.
