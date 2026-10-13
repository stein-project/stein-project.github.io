---
title: "Em desenvolvimento: Stein GFX"
date: 2026-10-03
summary: "A nova API gráfica do Stein organiza os pedidos do jogo e os envia à placa de vídeo de uma vez: de 1.100 pedidos por imagem para 3."
tags: [stein-gfx]
---

Toda imagem que aparece na tela é montada em duas partes do computador: o **processador**, que roda o jogo, e a **placa de vídeo**, que pinta a imagem. O **Stein GFX**, a nova API gráfica do Stein, muda a conversa entre os dois.

## O que é

O Minecraft 1.8.9 utiliza o **OpenGL de funções fixas**, a forma antiga de se comunicar com a placa de vídeo: o jogo dita cada passo, um de cada vez, e cada pedido é conferido pelo driver antes de seguir. Com 400 jogadores na tela, são cerca de **1.100 pedidos** e **4.100 trocas de textura** a cada imagem, quase tudo em um único núcleo do processador.

O **Stein GFX** é a nova API gráfica do Stein. Ele fica entre o jogo e a placa de vídeo: recebe os mesmos pedidos do jogo, mas, em vez de enviá-los um a um, **organiza tudo e envia de uma vez**, por meio do OpenGL moderno e, futuramente, do Vulkan.

**Hoje, no Minecraft 1.8.9:**

1. **O jogo** envia os pedidos **um por vez**.
2. O **OpenGL de funções fixas** repassa cada um deles.
3. A **placa de vídeo** recebe cerca de **1.100 pedidos** por imagem.

**Com o Stein GFX:**

1. **O jogo** faz os mesmos pedidos de sempre.
2. O **Stein GFX** organiza tudo e envia **tudo junto**.
3. O **OpenGL moderno** (e, em breve, o **Vulkan**) leva à **placa de vídeo** apenas **3 pedidos** por imagem.

## Como funciona

- **Anota, sem esperar**: os pedidos do jogo são registrados em vez de enviados na hora.
- **3 desenhos por imagem**: todos os corpos, depois todas as armaduras, depois o restante.
- **Texturas mantidas na placa de vídeo**: as skins ficam armazenadas na placa, sem trocas a cada desenho.
- **Vários núcleos do processador**: as posições dos jogadores são calculadas em paralelo.
- **Shaders próprios**: luz, cor e brilho são calculados diretamente na placa de vídeo.

> **O que é um shader?** É um pequeno programa executado pela placa de vídeo, que calcula a cor de cada parte da imagem. Todo jogo moderno usa shaders para desenhar qualquer coisa na tela. No Stein GFX, eles apenas **reproduzem a aparência original do 1.8.9**: não são os "shaders" do OptiFine, que alteram o visual do jogo.

**Hoje, no Minecraft 1.8.9**, o OpenGL de funções fixas só sabe seguir receitas prontas, e o jogo dita **cada passo, um de cada vez**:

- **No processador**, o jogo repete para cada parte de cada um dos 400 jogadores: usa a pele, gira o braço, liga a luz, desenha o braço, usa a armadura, desenha a armadura.
- **No OpenGL**, isso vira uma fila de "troca a textura, desenha, troca a textura, desenha", cerca de **1.100 vezes**.
- **A placa de vídeo** espera cada pedido antes de seguir: são **~1.100 desenhos por imagem**.

**Com o Stein GFX**, os pedidos do jogo são **anotados** e enviados **de uma vez só**:

- **No processador**, o jogo segue com a mesma lógica (usa a pele, gira o braço, desenha), mas cada pedido é anotado, sem esperar.
- **O Stein GFX** organiza o que foi anotado em listas: **todos os corpos**, **todas as armaduras** e **o resto**.
- **O OpenGL moderno** (e, depois, o Vulkan) entrega essas listas à placa em **3 desenhos**.
- **A placa de vídeo** calcula a imagem com os **shaders do Stein**: são **3 desenhos por imagem**.

## Ganhos até o momento

Medidos em um cenário com 400 jogadores, mobs, baús e placas:

- **~98 → ~210 FPS** em relação ao Stein atual.
- **1.100 → 3** pedidos à placa de vídeo por imagem.
- **7,6 → 3,8 ms** de trabalho da placa de vídeo por imagem.

A imagem, a física e o PvP permanecem os mesmos do jogo original. As animações dos jogadores, agora calculadas pelo Stein, foram conferidas e são idênticas às do jogo.

![Gráfico de FPS: Vanilla, OptiFine, Lunar + OptiFine, Stein e Stein GFX](fps-chart.png)

## Próximos passos

O Stein GFX ainda está em desenvolvimento e **não está disponível** nas versões atuais. Ele só passará a ser o padrão quando for igual ou superior ao Stein atual em todos os cenários testados.

### macOS

A Apple descontinuou o OpenGL em 2018: ele parou na versão 4.1 e, nas versões mais recentes do macOS, nem possui mais um driver próprio. Cada pedido do jogo é traduzido para o **Metal**, a API gráfica da Apple, por uma camada antiga e sem manutenção. Por esse limite, os efeitos visuais opcionais do Stein (como sombras e água) não funcionam no Mac hoje.

O Stein GFX muda esse cenário em duas etapas:

- **OpenGL 4.1 moderno**: o Stein GFX já possui um modo dentro do limite do Mac, o que permitirá que os efeitos visuais opcionais também funcionem no macOS.
- **Vulkan, futuramente**: no Mac, o Vulkan funciona sobre o Metal por meio do **MoltenVK**, uma camada mantida ativamente, no lugar da tradução legada do OpenGL.

Com isso, o Stein GFX é o caminho para um suporte completo ao macOS.

### Compatibilidade

O Stein é **modular**: será possível **desativar o Stein GFX na inicialização** do jogo.

Isso é necessário porque alguns mods usados hoje com o Stein são totalmente dependentes do OpenGL antigo e precisarão ser adaptados pelos seus desenvolvedores para funcionar com o Stein GFX. Enquanto isso, o modo atual, com todas as otimizações que o Stein já oferece, continua disponível.

Em algum momento no futuro, ainda **sem previsão**, o Stein GFX se tornará o padrão, e o modo antigo passará a ser uma **camada secundária**, com suporte mais limitado.
