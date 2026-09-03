# Shop Importadora Online

Repositório principal do aplicativo **Shop Importadora**.

## Objetivo

Este repositório passa a ser a fonte de versionamento e recuperação do projeto. Alterações novas devem ser registradas aqui antes de serem publicadas na Vercel.

## Base segura

A linha de recuperação confirmada é a **V62 rollback**.

- Branch congelada: `recovery/v62-rollback`
- Arquivos recuperados: `recovery/v62/`
- Histórico e referência de deployments: `RECOVERY.md`
- Regras de versionamento: `VERSION.md`

## Fluxo recomendado

1. Fazer a alteração em uma branch de trabalho.
2. Testar sem mexer diretamente na produção.
3. Aprovar a versão.
4. Integrar na `main`.
5. Só então publicar na Vercel.

## Segurança

Arquivos `.env`, tokens privados, service-role keys e outros segredos não devem ser commitados. O `.gitignore` do projeto já bloqueia os principais arquivos locais sensíveis.

Origem do projeto: Vercel `shop-importadora-online`.
