# Recuperação do Shop Importadora

Este repositório foi criado em 03/09/2026 para tirar o projeto da dependência exclusiva da Vercel e iniciar controle de versão no GitHub.

## Projeto Vercel
- Projeto: `shop-importadora-online`
- Project ID: `prj_O1tFgI3orUUUWUZwYtJd6GSfHtLH`
- Deployment atual identificado: `dpl_9A99e4CaXHkw7VEp5vEPYdPfgn8B`
- Deployment estático anterior validado com HTTP 200: `dpl_BzWTie1TsVKp2RPhuwaWcrDrtBRp`

## Estado da recuperação
- `recovery/index-v30.html`: snapshot histórico real do aplicativo.
- `manifest.webmanifest`: manifest PWA recuperado do deployment estável.
- O deployment atual foi compilado a partir de 5 arquivos de origem e possui funções Node (`app.js` e `asset.js`).
- Em 03/09/2026 o domínio principal começou a responder HTTP 502 em algumas requisições; por isso o deployment anterior estável foi mantido como referência de recuperação.

## Regra daqui para frente
Toda alteração importante deve entrar no GitHub antes de ir para produção. Assim cada versão terá um commit e será possível voltar sem depender de snapshots manuais da Vercel.
