---
title: "Stein GFX agora é a API gráfica principal do Stein"
date: 2026-10-12
summary: "O Stein GFX foi liberado como a API gráfica padrão do Stein Loader e do Stein Client. E o código do Stein vai ser aberto."
tags: [stein-gfx]
---

O **Stein GFX** foi liberado como a API gráfica padrão do **Stein Loader** e do **Stein Client**. Alguns jogadores relataram **até o dobro de FPS** em cenários de estresse, um ganho expressivo em relação à versão anterior.

## Compatibilidade

O Stein GFX traz mudanças grandes na forma como o jogo é desenhado. Por isso, **mods que utilizam diretamente a API gráfica antiga do jogo não funcionam** com ele.

Caso precise, é possível desativá-lo:

- **Stein Client**: em **Ajustes**, desligue a opção **Stein GFX**. A mudança vale a partir da próxima abertura do jogo.
- **Instalador**: adicione `-Dsteinbridge.gfx=false` aos argumentos do Java do perfil.

## Stein Lens

O **Stein Lens**, conjunto de efeitos visuais conhecidos como "shaders" (sombras, água, plantas ao vento e outros), foi **descontinuado** nesta versão. Ele será **refeito do zero sobre o Stein GFX**.

## Problemas conhecidos

- Falhas de **luminosidade** e **escurecimento da tela**.
- Instabilidades de desempenho no **1% low** (os momentos mais pesados).

Os problemas já foram identificados e as correções estão em andamento.

## Próximos passos

Entrou no backlog do projeto:

- **Connect**: autenticação automática em servidores que exigem login por comando no chat.

## Código aberto

O código-fonte do **Stein Bridge**, do **Stein Loader** e dos **mods oficiais** será aberto sob a licença **MPL 2.0**: qualquer pessoa poderá estudar, modificar e contribuir, desde que as alterações nos arquivos do projeto também permaneçam abertas.

Isso inclui o **Stein Bridge**, responsável pelas otimizações, pela modernização do jogo e pelo Stein GFX.

Quem tiver interesse em contribuir encontrará o código em [github.com/stein-project](https://github.com/stein-project).
