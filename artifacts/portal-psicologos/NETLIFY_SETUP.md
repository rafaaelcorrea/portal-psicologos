# Publicação segura no Netlify

O portal é um site estático em HTML, CSS3 e JavaScript puro. Ele usa Netlify Identity para autenticação e Netlify Blobs para manter o diretório compartilhado. O navegador nunca recebe uma senha de administrador.

## Configuração do site

1. Conecte o repositório ao Netlify usando a raiz do projeto.
2. O arquivo `netlify.toml` já define o comando de build, a pasta `artifacts/portal-psicologos/public` e as funções.
3. Em **Project configuration > Identity**, ative o Netlify Identity.
4. Crie ou convide a conta que administrará o portal.
5. Em **Project configuration > Environment variables**, crie:

   - `ADMIN_EMAIL`: e-mail exato da conta autorizada a gerenciar profissionais.

6. Faça um novo deploy.

## Como funciona

- Visitantes consultam `GET /api/professionals`.
- O ADM entra pela rota `/admin`.
- Inserção e exclusão exigem um token válido do Netlify Identity.
- A função valida o token e compara o e-mail com `ADMIN_EMAIL`.
- Os dados ficam no store persistente `claramente-directory`.
- O diretório inicial é criado a partir dos profissionais de exemplo na primeira leitura; a primeira gravação o transforma em dados persistentes do site.

Se o frontend for hospedado em outro domínio no futuro, defina também `ALLOWED_ORIGIN` com a origem exata do frontend. Para publicação normal no mesmo site Netlify, essa variável não é necessária.

## Rodar localmente

Na raiz do repositório:

```bash
pnpm --filter @workspace/portal-psicologos run dev
```

O servidor local usa apenas o módulo HTTP nativo do Node.js. Em desenvolvimento, os quatro profissionais de demonstração aparecem na página pública e nenhuma alteração administrativa é persistida localmente.