# Design: Finanças Pessoais App
**Data:** 2026-06-29

## Problema
Pessoas físicas têm dificuldade em controlar finanças pessoais de forma simples e visual. Dados dispersos entre extratos, planilhas e anotações avulsas, sem visão consolidada de receitas, despesas e saldo.

## Solução
Web app de gestão financeira pessoal com registro de transações, categorização e dashboard visual mensal. Autenticação via Supabase Auth, dados persistidos no Supabase (PostgreSQL) com RLS por usuário.

## Stack
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend/BaaS:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Deploy:** Vercel

## Arquitetura

### Estrutura de Páginas
| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Landing page com CTA | Público |
| `/login` | Login com e-mail/senha | Público |
| `/register` | Cadastro com e-mail/senha | Público |
| `/dashboard` | Cards de resumo + gráfico pizza | Autenticado |
| `/transactions` | Tabela com CRUD, filtros, busca, CSV | Autenticado |

Middleware Next.js protege `/dashboard` e `/transactions` redirecionando para `/login` se não autenticado.

### Banco de Dados (Supabase)

**Tabela: `transactions`**
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid NOT NULL REFERENCES auth.users(id)
description text NOT NULL
amount      numeric(12,2) NOT NULL
date        date NOT NULL
type        text NOT NULL CHECK (type IN ('income', 'expense'))
category    text NOT NULL
created_at  timestamptz DEFAULT now()
```

**Row Level Security:**
- `SELECT`: user_id = auth.uid()
- `INSERT`: user_id = auth.uid()
- `UPDATE`: user_id = auth.uid()
- `DELETE`: user_id = auth.uid()

### Categorias (constantes no frontend)
- Despesas: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Outros
- Receitas: Salário, Freelance, Outros

## Componentes Principais

### Dashboard (`/dashboard`)
- Card: Receita Total do mês
- Card: Despesa Total do mês
- Card: Saldo (receitas - despesas)
- PieChart (Recharts): distribuição de despesas por categoria
- Filtro de mês/ano

### Transações (`/transactions`)
- Tabela de transações com paginação
- Filtros: mês/ano, categoria, tipo
- Busca por descrição (texto)
- Botão "Nova Transação" → modal com formulário (criar/editar)
- Botão "Exportar CSV" das transações filtradas
- Ações por linha: editar, excluir

### Formulário de Transação (modal)
Campos: descrição, valor, data, tipo (receita/despesa), categoria

## UI/UX
- shadcn/ui para todos os componentes (Button, Card, Input, Select, Dialog, Table)
- Paleta neutra com acento azul/verde
- Layout responsivo para desktop e mobile
- Sidebar ou navbar simples para navegação

## Features
1. **Auth:** Login e cadastro com e-mail/senha via Supabase Auth
2. **Dashboard:** Cards resumo + PieChart por categoria
3. **CRUD Transações:** Criar, editar, excluir via modal
4. **Categorias:** Pré-definidas como constantes
5. **Filtros:** Mês/ano, categoria, tipo, busca por texto
6. **Export CSV:** Download das transações filtradas
7. **Responsivo:** Tailwind CSS, mobile-first
8. **Landing Page:** Apresentação do app com CTA para cadastro
