# Connect & Harmony — Portal de Psicólogos

Portal mobile-first para encontrar psicólogos por especialidade e iniciar uma conversa pelo WhatsApp.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- Cloudflare Pages Functions
- Cloudflare Workers KV
- Cloudflare Access

O frontend não usa React, TypeScript, Tailwind, Vite ou qualquer framework de frontend.

## Estrutura principal

```text
artifacts/portal-psicologos/
├── public/
│   ├── index.html                     # Estrutura inicial da página
│   ├── app.js                         # Estado, renderização e eventos
│   ├── seed-data.js                   # Dados iniciais, usados pelo site e pela API
│   ├── styles.css                     # Estilos e responsividade
│   ├── favicon.svg
│   └── robots.txt
├── functions/api/
│   ├── professionals.js               # Leitura pública do diretório
│   ├── faq.js                         # Leitura pública das dúvidas
│   └── admin/
│       ├── _middleware.js             # Confere o login antes de tudo em /api/admin
│       ├── session.js                 # Quem está logado
│       ├── professionals/[[path]].js  # Criar, editar e excluir profissionais
│       └── faq/[[path]].js            # Criar, editar, reordenar e excluir dúvidas
├── lib/
│   ├── auth.js                        # Validação do token do Cloudflare Access
│   ├── http.js                        # Resposta JSON padrão
│   └── store.js                       # Leitura e gravação no KV
├── server.mjs                         # Servidor local sem dependências de frontend
├── CLOUDFLARE_SETUP.md                # Configuração de autenticação e deploy
└── package.json
```

## Rodar localmente

Pré-requisito: Node.js e pnpm.

```bash
pnpm install
pnpm --filter @workspace/portal-psicologos run dev
```

O comando de instalação funciona no Windows, macOS e Linux. No Windows, use o
PowerShell ou o Prompt de Comando; não é necessário instalar `sh` ou Git Bash.

Abra o endereço exibido pelo servidor. No ambiente local, a página pública usa dados de demonstração. A autenticação e as alterações administrativas ficam disponíveis depois da publicação no Cloudflare Pages.

## Publicar no GitHub

1. Crie um repositório vazio no GitHub.
2. Na raiz deste projeto, inicialize o Git se necessário:

   ```bash
   git init
   git add .
   git commit -m "chore: primeira versão do portal Connect & Harmony"
   ```

3. Conecte o repositório remoto e envie os arquivos:

   ```bash
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```

4. No Cloudflare Pages, importe esse repositório usando `artifacts/portal-psicologos` como diretório raiz e `public` como pasta publicada.
5. Vincule o KV `DIRECTORY` e configure o login pelo Cloudflare Access, seguindo `artifacts/portal-psicologos/CLOUDFLARE_SETUP.md`.

Não inclua senhas, tokens ou arquivos `.env` no GitHub.