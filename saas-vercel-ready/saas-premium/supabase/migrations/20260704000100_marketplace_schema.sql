/*
# Migration: marketplace items, purchases, and atomic purchase RPC

Replaces the previously hardcoded/fake Marketplace.tsx catalog with real,
queryable data. Purchases spend the same credit currency already used for
AI generation elsewhere in the app (profiles.credits / credit_ledger) —
this is an internal credits marketplace, not a real-money multi-vendor
store with creator payouts (that's a materially bigger project).
*/

CREATE TABLE IF NOT EXISTS marketplace_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('templates','voices','music','effects','transitions')),
  description text NOT NULL DEFAULT '',
  price_credits integer NOT NULL DEFAULT 0 CHECK (price_credits >= 0),
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  downloads_count integer NOT NULL DEFAULT 0,
  badge text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_user_id ON marketplace_purchases(user_id);

ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can read marketplace items" ON marketplace_items;
CREATE POLICY "anyone can read marketplace items"
  ON marketplace_items FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "users read own purchases" ON marketplace_purchases;
CREATE POLICY "users read own purchases"
  ON marketplace_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Atomic purchase: validates funds + ownership, deducts credits, records the
-- ledger entry and the purchase in a single transaction. Runs as SECURITY
-- DEFINER so it can update profiles/credit_ledger without needing broad
-- client-side write policies on those tables.
CREATE OR REPLACE FUNCTION purchase_marketplace_item(p_item_id uuid)
RETURNS marketplace_purchases
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item marketplace_items;
  v_credits integer;
  v_purchase marketplace_purchases;
BEGIN
  SELECT * INTO v_item FROM marketplace_items WHERE id = p_item_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Item not found';
  END IF;

  IF EXISTS (SELECT 1 FROM marketplace_purchases WHERE user_id = auth.uid() AND item_id = p_item_id) THEN
    RAISE EXCEPTION 'Already owned';
  END IF;

  SELECT credits INTO v_credits FROM profiles WHERE id = auth.uid() FOR UPDATE;
  IF v_credits IS NULL OR v_credits < v_item.price_credits THEN
    RAISE EXCEPTION 'Not enough credits';
  END IF;

  UPDATE profiles SET credits = credits - v_item.price_credits WHERE id = auth.uid();

  INSERT INTO credit_ledger (user_id, delta, reason, ref_id)
  VALUES (auth.uid(), -v_item.price_credits, 'usage', v_item.id);

  UPDATE marketplace_items SET downloads_count = downloads_count + 1 WHERE id = p_item_id;

  INSERT INTO marketplace_purchases (user_id, item_id) VALUES (auth.uid(), p_item_id)
  RETURNING * INTO v_purchase;

  RETURN v_purchase;
END;
$$;

-- Seed catalog (idempotent: only inserts if the table is empty)
INSERT INTO marketplace_items (title, category, description, price_credits, rating, downloads_count, badge)
SELECT * FROM (VALUES
  ('Nike-Style Ad Pack',       'templates',   'A 5-scene template tuned for punchy product ad videos.', 120, 4.9, 2840, 'Best seller'),
  ('Lofi Chill Beats Vol.2',   'music',       'Royalty-free lofi backing tracks, 8 loops.',              80,  4.7, 1520, 'New'),
  ('Emma Pro — UK English',    'voices',      'A warm, professional UK-accented narration voice.',       150, 5.0, 3100, 'Top rated'),
  ('Cinematic Glitch FX',      'effects',     'Glitch and chromatic-aberration overlay pack.',           100, 4.6, 980,  NULL),
  ('SaaS Demo Template',       'templates',   'Screen-recording-style template for product demos.',      0,   4.5, 5200, 'Free'),
  ('Smooth Slide Transitions', 'transitions', '12 smooth slide/wipe transition presets.',                60,  4.8, 2100, NULL),
  ('Epic Trailer Music Pack',  'music',       'Orchestral trailer stingers and builds.',                 200, 4.9, 1780, 'Best seller'),
  ('Lucas — French Voice',     'voices',      'A natural French male narration voice.',                  150, 4.8, 890,  'New')
) AS seed(title, category, description, price_credits, rating, downloads_count, badge)
WHERE NOT EXISTS (SELECT 1 FROM marketplace_items);
