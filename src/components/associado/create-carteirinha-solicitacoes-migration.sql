
-- This SQL file is for reference only, it should be executed in the Supabase SQL Editor

-- Create the enum for carteirinha solicitation status
CREATE TYPE carteirinha_status AS ENUM (
  'pendente_pagamento',
  'pagamento_aprovado',
  'em_producao',
  'enviado',
  'entregue',
  'cancelado'
);

-- Create table for ID card requests
CREATE TABLE IF NOT EXISTS carteirinha_solicitacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  associado_id UUID NOT NULL REFERENCES associados(id),
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  endereco_entrega TEXT NOT NULL,
  complemento TEXT,
  valor NUMERIC NOT NULL DEFAULT 15.00,
  status carteirinha_status NOT NULL DEFAULT 'pendente_pagamento',
  pagamento_id TEXT,
  codigo_rastreio TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for system configurations
CREATE TABLE IF NOT EXISTS system_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default configuration values
INSERT INTO system_config (key, value) VALUES
  ('PAYMENT_GATEWAY', 'asaas'),
  ('ID_CARD_FEE', '15.00');

-- Create RLS policies for the tables
ALTER TABLE carteirinha_solicitacoes ENABLE ROW LEVEL SECURITY;

-- Allow admins to do anything
CREATE POLICY admin_all_carteirinha_solicitacoes
  ON carteirinha_solicitacoes
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Allow users to view their own requests
CREATE POLICY user_select_own_solicitacoes
  ON carteirinha_solicitacoes
  FOR SELECT
  USING (associado_id IN (
    SELECT id FROM associados WHERE email = (
      SELECT email FROM auth.users WHERE auth.users.id = auth.uid()
    )
  ));

-- Allow users to insert their own requests
CREATE POLICY user_insert_own_solicitacoes
  ON carteirinha_solicitacoes
  FOR INSERT
  WITH CHECK (associado_id IN (
    SELECT id FROM associados WHERE email = (
      SELECT email FROM auth.users WHERE auth.users.id = auth.uid()
    )
  ));
