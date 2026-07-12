/*
# Migration: JVZoo IPN transaction log

Tracks every processed JVZoo notification (by receipt number) so retried
IPN calls never double-grant credits or double-process a refund. Locked
down like the other infra tables — service-role (the jvzoo-ipn function)
only.
*/

CREATE TABLE IF NOT EXISTS jvzoo_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt text NOT NULL UNIQUE,
  transaction_type text NOT NULL,
  buyer_email text NOT NULL,
  product_id text NOT NULL,
  amount numeric,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE jvzoo_transactions ENABLE ROW LEVEL SECURITY;
-- Intentionally no policies: default-deny, service-role only.
