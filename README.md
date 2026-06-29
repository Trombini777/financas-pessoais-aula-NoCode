# FinançasApp

App de gestão financeira pessoal — projeto de aula NoCode com Claude Code.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + **shadcn/ui**
- **Recharts** (gráficos)
- **Supabase** (PostgreSQL + Auth + Row Level Security)
- **Vercel** (deploy)

## Funcionalidades

- Login e cadastro com e-mail/senha (Supabase Auth)
- Dashboard com cards de receita, despesa e saldo + gráfico de pizza por categoria
- CRUD de transações (criar, editar, excluir)
- Filtros por mês, ano, categoria e tipo
- Busca por descrição
- Exportação em CSV
- Layout responsivo (mobile + desktop)
- Cada usuário vê apenas suas próprias transações (RLS)

---

## Configuração local

### 1. Clone o repositório

```bash
git clone https://github.com/Trombini777/financas-pessoais-aula-NoCode.git
cd financas-pessoais-aula-NoCode
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais do Supabase:

```bash
cp .env.example .env.local
```

Edite o `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxx
```

> As credenciais ficam **apenas no `.env.local`** — esse arquivo está no `.gitignore` e nunca vai para o GitHub.

### 4. Crie a tabela no Supabase

No painel do Supabase, vá em **SQL Editor** e execute o conteúdo do arquivo [`supabase-setup.sql`](./supabase-setup.sql).

### 5. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Deploy na Vercel

### 1. Conecte o repositório

Acesse [vercel.com/new](https://vercel.com/new), clique em **Import Git Repository** e selecione este repositório.

### 2. Adicione as variáveis de ambiente

Antes de confirmar o deploy, adicione as variáveis em **Environment Variables**:

| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key do Supabase |

> **Nunca** adicione chaves secretas (service_role) como `NEXT_PUBLIC_*` — elas ficariam expostas no navegador.

### 3. Deploy

Clique em **Deploy**. A Vercel detecta automaticamente que é um projeto Next.js e configura tudo.

---

## Segurança

- `.env.local` está no `.gitignore` — credenciais nunca vão ao repositório
- As únicas chaves usadas são a `anon/publishable key` do Supabase, que é **pública por design** — ela só permite o que as políticas RLS autorizam
- Row Level Security garante que cada usuário acessa **apenas seus próprios dados**
- Não há backend separado nem chaves secretas no código

---

## Estrutura do projeto

```
app/
├── page.tsx              # Landing page
├── login/                # Tela de login
├── register/             # Tela de cadastro
├── auth/callback/        # Callback OAuth
├── dashboard/            # Dashboard (protegido)
└── transactions/         # Transações (protegido)

components/finance/
├── navbar.tsx            # Navbar responsiva
├── category-chart.tsx    # Gráfico de pizza
└── transaction-modal.tsx # Modal criar/editar

lib/
├── types.ts              # Tipos TypeScript + categorias
└── supabase/             # Clientes Supabase (browser + server)

proxy.ts                  # Proteção de rotas autenticadas
supabase-setup.sql        # SQL para criar tabela e políticas RLS
```
