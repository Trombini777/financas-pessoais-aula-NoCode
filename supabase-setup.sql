-- =============================================
-- Finanças Pessoais App — Setup do Supabase
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Criar tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount      numeric(12, 2) NOT NULL CHECK (amount > 0),
  date        date NOT NULL,
  type        text NOT NULL CHECK (type IN ('income', 'expense')),
  category    text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Habilitar Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS — cada usuário acessa apenas seus próprios dados

CREATE POLICY "Usuário lê suas transações"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário insere suas transações"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário edita suas transações"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário exclui suas transações"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Índice para melhorar consultas por usuário e data
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON transactions (user_id, date DESC);

-- =============================================
-- Pronto! A tabela e as políticas estão criadas.
-- =============================================
