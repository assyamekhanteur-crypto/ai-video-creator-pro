/*
# Migration: track failed payments on profiles

Set to true by the stripe-webhook on invoice.payment_failed, reset to
false on the next successful invoice.paid — lets the frontend show a
"update your payment method" banner instead of silently doing nothing.
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_issue boolean NOT NULL DEFAULT false;
