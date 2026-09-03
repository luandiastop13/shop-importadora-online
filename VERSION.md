# Controle de versão — Shop Importadora

## Base de recuperação

- Versão identificada: **v62-rollback**
- Projeto Vercel: `shop-importadora-online`
- Projeto ID: `prj_O1tFgI3orUUUWUZwYtJd6GSfHtLH`
- Deployment estável de referência: `dpl_BzWTie1TsVKp2RPhuwaWcrDrtBRp`
- URL do deployment: `shop-importadora-online-66j48t1b0-luandiastop13-2031.vercel.app`
- Branch congelada: `recovery/v62-rollback`

## Regra daqui para frente

1. Toda alteração deve entrar primeiro no GitHub.
2. Não editar a produção diretamente sem um commit correspondente.
3. Alterações novas devem ser testadas antes de chegar à `main`.
4. A branch `recovery/v62-rollback` deve ser mantida como ponto de restauração.
5. Arquivos `.env` e chaves secretas nunca devem ser enviados ao repositório.

## Estado da recuperação

- Snapshot HTML histórico preservado em `recovery/`.
- `base.js` original da linha V62 recuperado e salvo em `recovery/v62/base.js`.
- Manifest PWA preservado.
- Demais assets estão sendo recuperados somente quando a origem pode ser confirmada; nenhum arquivo será inventado para completar o backup.
