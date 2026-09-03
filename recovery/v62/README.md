# Recovery V62

Ponto de recuperação identificado como **v62-rollback** a partir dos deployments do projeto `shop-importadora-online` na Vercel.

## Confirmado

- `base.js` recuperado diretamente do deployment estável.
- O asset `app.css` respondeu com o header `x-shop-version: v62-rollback`, confirmando a identificação da linha de recuperação.
- O projeto usa Supabase como backend.
- O snapshot HTML histórico está preservado no diretório `recovery/`.

## Referência Vercel

- Deployment: `dpl_BzWTie1TsVKp2RPhuwaWcrDrtBRp`
- Host: `shop-importadora-online-66j48t1b0-luandiastop13-2031.vercel.app`

## Regra

Não substituir arquivos faltantes por versões inventadas ou reconstruídas sem marcar claramente a origem. Esta pasta serve como evidência e base de restauração.
