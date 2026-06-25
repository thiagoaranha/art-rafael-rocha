# Rafael Rocha — Art Portfolio Site

Site de portfólio do artista visual Rafael Rocha com sistema dinâmico de gestão de obras.

## Stack

- **Frontend**: HTML + Vanilla JS + TailwindCSS CDN
- **Backend**: Netlify Functions (Node.js serverless)
- **Banco de Dados**: Netlify Database (PostgreSQL via Neon)
- **Imagens**: Cloudinary (CDN + Upload Widget)

## Estrutura do Projeto

```
├── index.html                   # Site público
├── admin/index.html             # Painel administrativo
├── netlify/functions/
│   ├── artworks.js              # GET /api/artworks (público)
│   ├── artworks-admin.js        # POST/PUT/DELETE /api/artworks-admin (protegido)
│   └── auth.js                  # POST /api/auth (login do admin)
├── db/init.sql                  # Script de inicialização do banco de dados
├── netlify.toml                 # Configuração do Netlify
└── package.json
```

## Configuração Inicial (Primeira vez)

### 1. Instalar dependências

```bash
npm install
```

### 2. Fazer login e vincular ao Netlify

```bash
npx netlify login
npx netlify link
```

### 3. Criar o banco de dados

```bash
npx netlify db init
```

### 4. Criar a tabela de obras

```bash
npx netlify db query < db/init.sql
```

### 5. Configurar variáveis de ambiente

No [painel do Netlify](https://app.netlify.com) → seu site → **Site configuration → Environment variables**, adicione:

| Variável | Valor | Descrição |
|---|---|---|
| `ADMIN_PASSWORD` | (senha escolhida) | Senha do painel administrativo |
| `API_TOKEN` | (token secreto) | Token para autorizar operações de escrita |

> Use uma senha forte e um token aleatório longo (ex: gerado por `openssl rand -hex 32`).

### 6. Configurar Upload Preset no Cloudinary

1. Acesse o [Console do Cloudinary](https://console.cloudinary.com)
2. Vá em **Settings → Upload → Upload presets**
3. Clique em **Add upload preset**
4. Configure:
   - **Preset name**: `up_rafael`
   - **Signing mode**: `Unsigned`
   - **Folder**: `rafael-rocha` (opcional, para organização)
5. Salve

### 7. Rodar localmente

```bash
npm run dev
```

O site público estará em `http://localhost:8888` e o painel admin em `http://localhost:8888/admin`.

## Deploy

O deploy é automático: basta fazer push para o branch `main` do repositório GitHub.

```bash
git add .
git commit -m "feat: initial dynamic site setup"
git push origin main
```

## Uso do Painel Admin

1. Acesse `https://seu-site.netlify.app/admin`
2. Digite a senha configurada em `ADMIN_PASSWORD`
3. Para adicionar uma obra: preencha o formulário → clique em "Adicionar imagens" → salve
4. As obras mais novas aparecerão automaticamente no topo do site público
