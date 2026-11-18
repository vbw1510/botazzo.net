# Botazzo.Net — versão 3

Site em 5 páginas, todas com o mesmo menu:

| Menu | Arquivo | Conteúdo |
|---|---|---|
| Início | `index.html` | Topo de conserto + carrossel, números, 3D "Na prática", resumo dos consertos, 3 maiores projetos, contato |
| Consertos | `consertos.html` | Todos os aparelhos, fotos e vídeos ("Na bancada"), como funciona |
| Sites & Apps | `desenvolvimento.html` | O que eu desenvolvo, código, tecnologias, projetos |
| Portfólio | `portfolio.html` | Todos os projetos com galeria e prévia |
| Sobre | `sobre.html` | Sobre mim, bonequinho 3D, habilidades, recrutadores, redes |

Links diretos para cada aparelho: `consertos.html#celular`, `#notebook`, `#computador`, `#tv`, `#eletronicos`.

## Estrutura
- `assets/css/style.css` — estilos
- `assets/js/main.js` — configurações (WhatsApp, fotos, vídeos) no topo + animações
- `assets/img/banners/` — imagens do carrossel do topo
- `assets/img/manutencoes/` — fotos da seção "Na bancada"
- `assets/img/projetos/` — prints dos projetos do portfólio

## Carrossel (topo do site)
Salve as imagens de divulgação como `banner-1.jpg`, `banner-2.jpg`, `banner-3.jpg`, `banner-4.jpg`
em `assets/img/banners/`. Tamanho ideal: **1200 x 900** (formato 4:3), deixe a parte de baixo
mais limpa porque é onde ficam as bolinhas e as setas.
Se uma imagem não existir, aparece o banner desenhado no lugar dela.
Para ter mais slides, copie um bloco `<div class="slide">` no index.html.

## Fotos de manutenção
Salve em `assets/img/manutencoes/` e edite a lista `fotos` no topo de `assets/js/main.js`
(nome do arquivo + legenda). A primeira foto aparece maior.

## Vídeos (YouTube)
1. Suba o vídeo no YouTube como **Não listado** (vídeo **Privado não toca** fora do YouTube).
2. Copie o código do link: `https://youtu.be/AbC123xYz` → `AbC123xYz`
3. Cole em `videos` no topo de `assets/js/main.js`: `{ id: "AbC123xYz", titulo: "..." }`
4. Para Shorts (vídeo em pé): `{ id: "...", titulo: "...", formato: "vertical" }`

## Antes de publicar
No topo do `main.js`, mude `modoPreparo: true` para `false`.
Assim os espaços vazios com instruções somem e só aparece o que existir.

## Imagens dos projetos (mini carrossel + janela de prévia)
1. Jogue as fotos na pasta do projeto, com qualquer nome (WhatsApp, prints...).
2. Dê dois cliques em **`organizar-fotos.bat`** (na pasta principal do site).
3. Pronto: as fotos viram `1`, `2`, `3`... A **foto 1 é a capa** do card.

- Aceita `.jpg`, `.jpeg`, `.png` e `.webp`; o site mostra até **12 fotos** por projeto.
- Fotos novas entram depois das que já estão numeradas. Se apagar uma, rode o `.bat` de novo que ele fecha o buraco.
- Para trocar a capa: renomeie a foto escolhida para `1` (e a antiga `1` para outro número), depois rode o `.bat`.
- Fotos deitadas (print de computador) ficam melhores no card; fotos em pé também funcionam.

| Projeto | Pasta |
|---|---|
| MT2 Viber | `assets/img/projetos/mt2-viber/` |
| Terrália Farm | `assets/img/projetos/terralia-farm/` |
| Viber RPG | `assets/img/projetos/viber-rpg/` |
| Botazzo OS | `assets/img/projetos/botazzo-os/` |
| AtecedorStore | `assets/img/projetos/atecedorstore/` |
| Bancada | `assets/img/projetos/bancada/` |

## Vídeos dos projetos (YouTube)
1. Suba o vídeo no YouTube como **Não listado** (vídeo **Privado não toca** fora do YouTube).
2. Copie o link (botão Compartilhar → Copiar).
3. Abra `assets/js/main.js` (Bloco de Notas ou VS Code) e, logo no começo, procure **`videosProjetos`**.
4. Cole o link entre as aspas do projeto e salve:
   ```
   "mt2-viber":     "https://youtu.be/AbC123xYz",
   ```
- Serve qualquer link do YouTube, inclusive de Shorts (vídeo em pé).
- O vídeo vira o 1º item da prévia (antes das fotos) e o card ganha o selo vermelho **▶ Vídeo**.

## 3D (celular e notebook sendo consertados + bonequinho)
A cena alterna o conserto de um celular e de um notebook (12 segundos cada).
Se o Windows estiver com "Efeitos de animação" desligado, a cena continua animando, só que mais calma.
Feito em código com Three.js (licença MIT, em `assets/vendor/three/`), sem modelos baixados.
- Arquivo usado pelo site: `assets/js/scene3d.js` (só carrega quando a pessoa chega na seção)
- Código-fonte para editar: `assets/js/scene3d.src.js`
- Depois de editar o fonte, gere de novo o arquivo do site:
  `npx esbuild assets/js/scene3d.src.js --bundle --minify --format=iife --outfile=assets/js/scene3d.js`
