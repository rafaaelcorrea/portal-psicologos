# ClaraMente — Portal de Psicólogos

Portal mobile-first para encontrar psicólogos por especialidade e iniciar uma conversa pelo WhatsApp.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- Netlify Functions
- Netlify Identity
- Netlify Blobs

O frontend não usa React, TypeScript, Tailwind, Vite ou qualquer framework de frontend.

## Estrutura principal

```text
artifacts/portal-psicologos/
├── public/
│   ├── index.html                     # Estrutura inicial da página
│   ├── app.js                         # Estado, renderização e eventos
│   ├── styles.css                     # Estilos e responsividade
│   ├── favicon.svg
│   └── robots.txt
├── netlify/functions/
│   └── professionals.mjs              # API protegida do diretório
├── server.mjs                         # Servidor local sem dependências de frontend
├── NETLIFY_SETUP.md                   # Configuração de autenticação e deploy
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

Abra o endereço exibido pelo servidor. No ambiente local, a página pública usa dados de demonstração. A autenticação e as alterações administrativas ficam disponíveis depois da publicação no Netlify.

## Publicar no GitHub

1. Crie um repositório vazio no GitHub.
2. Na raiz deste projeto, inicialize o Git se necessário:

   ```bash
   git init
   git add .
   git commit -m "chore: primeira versão do portal ClaraMente"
   ```

3. Conecte o repositório remoto e envie os arquivos:

   ```bash
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```

4. No Netlify, importe esse repositório usando a raiz do projeto. O `netlify.toml` já contém o comando de build, a pasta publicada e o caminho das funções.
5. Ative o Netlify Identity e configure `ADMIN_EMAIL`, seguindo `artifacts/portal-psicologos/NETLIFY_SETUP.md`.

Não inclua senhas, tokens ou arquivos `.env` no GitHub.