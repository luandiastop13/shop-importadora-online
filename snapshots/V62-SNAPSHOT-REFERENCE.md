# V62 aprovada — referência de recuperação

Esta branch representa a versão V62 aprovada do app Shop Importadora e deve ser mantida sem alterações funcionais.

## Snapshot HTML integral

O snapshot HTML integral continua preservado no Supabase do projeto:

- Projeto Supabase: `epmsawunhkjkfytzlygp`
- Tabela: `public.app_assets_v47`
- Caminho: `/index-v62-update-stability.html`
- Tamanho decodificado: `352696` bytes
- MD5 do conteúdo decodificado: `d82d1b843c43b8009cb1bce953e0fdc5`
- Atualizado em: `2026-09-03 00:42:42.471815+00`

## Branches de segurança

- `golden/v62-approved`: cópia congelada aprovada para restauração.
- `recovery/v62-rollback`: branch de recuperação usada para reconstruir a V62.

## Regra de segurança

Não desenvolver diretamente nesta branch. Novas alterações devem partir de uma branch separada e só podem chegar à produção depois de validação.

Observação: o `manifest.webmanifest` referencia `icon-512.png`, porém esse arquivo não foi localizado no cofre de assets original; ele não foi inventado nem substituído para preservar a fidelidade da recuperação.
