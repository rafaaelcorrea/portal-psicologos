# Publicação segura no Cloudflare Pages

O portal é um site estático em HTML, CSS3 e JavaScript puro. Ele usa Pages Functions para a API, Workers KV para guardar os dados e Cloudflare Access para o login do administrador. Não existe senha: o administrador informa o e-mail e recebe um código de acesso.

Os nomes dos menus do painel do Cloudflare mudam com frequência; se algum não estiver exatamente como descrito aqui, procure pelo equivalente.

## 1. Criar o projeto Pages

1. No painel do Cloudflare, abra **Workers & Pages > Create > Pages > Connect to Git** e escolha o repositório.
2. Em **Build settings**, preencha:

   - **Framework preset**: `None`
   - **Build command**: deixe em branco
   - **Build output directory**: `public`
   - **Root directory (advanced)**: `artifacts/portal-psicologos`

   O diretório raiz precisa ser `artifacts/portal-psicologos`, porque é nele que o Cloudflare procura a pasta `functions/`.

3. Opcional: em **Settings > Variables and Secrets**, crie `SKIP_DEPENDENCY_INSTALL` = `1`. O site não tem dependências, então o build fica mais rápido sem a instalação.

O projeto precisa ser do tipo **Pages**, não **Worker**. Ao importar um repositório, o painel pode criar um Worker por padrão; nesse caso a pasta `functions/` é ignorada e a API não existe. Para conferir, abra as configurações de build: um projeto Pages tem o campo **Build output directory**; um Worker tem **Deploy command**.

Anote o endereço do site (por exemplo, `meu-portal.pages.dev`).

## 2. Criar o armazenamento

1. Em **Storage & Databases > KV**, crie um namespace (por exemplo, `portal-directory`).
2. No projeto Pages, em **Settings > Bindings > Add > KV namespace**, vincule esse namespace com o nome de variável `DIRECTORY`.

## 3. Configurar o login (Cloudflare Access)

1. Abra o painel **Zero Trust**. No primeiro acesso ele pede um nome de equipe e um plano; o plano gratuito atende até 50 usuários. O nome de equipe define o seu domínio do Access: `nome-da-equipe.cloudflareaccess.com`.
2. Em **Settings > Authentication**, confirme que o método **One-time PIN** está ativo. É ele que envia o código por e-mail.
3. Em **Access > Applications**, adicione um aplicativo do tipo **Self-hosted** e inclua **dois** endereços, ambos no domínio do site:

   - domínio `meu-portal.pages.dev`, caminho `admin`
   - domínio `meu-portal.pages.dev`, caminho `api/admin`

   Os dois são necessários: o primeiro protege a tela, o segundo protege as gravações.

4. Escolha a duração da sessão (por exemplo, 24 horas). Passado esse tempo, o administrador recebe um novo código.
5. Crie uma política com ação **Allow** e, em **Include**, selecione **Emails** e liste os e-mails dos administradores. Só esses e-mails recebem o código.
6. Depois de salvar, abra o aplicativo e copie o **Application Audience (AUD) Tag**.

## 4. Ligar o site ao Access

No projeto Pages, em **Settings > Variables and Secrets**, crie:

- `ACCESS_TEAM_DOMAIN`: o domínio da equipe, por exemplo `nome-da-equipe.cloudflareaccess.com`.
- `ACCESS_AUD`: o AUD Tag copiado no passo anterior.

Faça um novo deploy. Bindings e variáveis só valem para deploys feitos depois de salvos.

## Como funciona

- Visitantes leem `GET /api/professionals` e `GET /api/faq`, sem login.
- O ADM abre `/admin`. O Cloudflare Access intercepta, pede o e-mail e envia o código. Só depois disso a página carrega.
- Tudo o que altera dados fica em `/api/admin/...`. A cada pedido, o Access anexa um token assinado, e `functions/api/admin/_middleware.js` confere a assinatura, o aplicativo (`ACCESS_AUD`) e a validade antes de deixar o pedido seguir.
- Se `ACCESS_TEAM_DOMAIN` ou `ACCESS_AUD` não estiverem definidos, ou se o aplicativo do Access não cobrir `api/admin`, a API administrativa recusa tudo. Uma configuração incompleta bloqueia o ADM, nunca libera o acesso.
- "Sair" encerra a sessão do Access.
- Para adicionar ou remover um administrador, edite a lista de e-mails na política do Access. Não é preciso novo deploy.
- Os dados ficam no KV vinculado como `DIRECTORY`, nas chaves `professionals.json` e `faq.json`.
- O conteúdo inicial vem de `public/seed-data.js`; a primeira gravação o transforma em dados persistentes do site.
- Os textos e o comportamento da seção de dúvidas ficam em `FAQ_CONFIG`, no início de `public/app.js`. Os limites de tamanho e de quantidade ficam em `FAQ_LIMITS`, em `functions/api/admin/faq/[[path]].js`.
- Rotas sem arquivo correspondente, como `/admin`, recebem o `index.html` automaticamente.

O KV é eventualmente consistente: uma alteração pode levar até cerca de um minuto para aparecer para todos os visitantes.

## Cuidados

- **Domínio próprio**: ao adicionar um domínio próprio ao site, inclua no aplicativo do Access os mesmos dois caminhos nesse domínio. O endereço `.pages.dev` continua existindo e deve permanecer protegido.
- **Deploys de pré-visualização**: eles usam outros endereços (`abc123.meu-portal.pages.dev`), que o aplicativo acima não cobre. Neles a área administrativa fica bloqueada, o que é o comportamento seguro.
- **Troca de conta**: o Access pertence à conta do Cloudflare. Ao mover o projeto para outra conta, refaça os passos 3 e 4; o domínio da equipe e o AUD Tag serão outros.

Se o frontend for hospedado em outro domínio no futuro, defina também `ALLOWED_ORIGIN` com a origem exata do frontend. Isso libera apenas a leitura pública do diretório; a área administrativa funciona somente no mesmo domínio da API.

## Rodar localmente

Na raiz do repositório:

```bash
pnpm --filter @workspace/portal-psicologos run dev
```

O servidor local usa apenas o módulo HTTP nativo do Node.js. Em desenvolvimento, os dados de exemplo aparecem na página pública, e a área administrativa não fica disponível.
