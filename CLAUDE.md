# Instrucoes do projeto

## Objetivo

Este projeto e um aplicativo web simples para criar uma imagem de um bloco de codigo, com um card central para escrever e visualizar codigo, inspirado no Ray.so.

## Tecnologias e organizacao

- Use somente HTML, CSS e JavaScript, sem frameworks ou dependencias de framework.
- Mantenha a estrutura e a semantica HTML em `index.html`.
- Mantenha todo o JavaScript em `scripts/app.js`.
- Mantenha todo o CSS em `styles/theme.css`.
- Siga boas praticas de HTML, CSS e JavaScript. Use elementos HTML semanticos e acessibilidade adequada.
- Para syntax highlighting, use Shiki com WASM, carregado por JavaScript via CDN.
- Para exportar o card como imagem, use `html-to-image` ou `dom-to-image`, carregado via CDN. Escolha uma das bibliotecas quando a funcionalidade for implementada.

## Arquivos existentes

- `index.html`: estrutura HTML inicial, atualmente com um documento basico e sem conteudo de aplicacao.
- `scripts/app.js`: arquivo JavaScript existente, atualmente vazio.
- `styles/theme.css`: arquivo de estilos do projeto.

Ao trabalhar no projeto, preserve a separacao de responsabilidades acima. Nao adicione frameworks nem mova codigo entre esses arquivos sem necessidade.
