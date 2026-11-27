/*
# VELEURA catalogue: products, bundles, bundle items, reviews, content blocks

1. New Tables
- `products`: the seven individual VELEURA products. Holds name, slug, category,
  price_pkr (temporary placeholder PKR 1,999 flagged via price_approved = false),
  stock, images (jsonb array of image slot urls), short intro, description, ingredients,
  how_to_use, details (jsonb array), faqs (jsonb array), featured/community flags,
  display order, publish flag.
- `bundles`: the three approved bundles with exact composition managed in `bundle_items`,
  own imagery, description, and price_pkr which stays NULL until the owner approves it
  (purchase stays disabled while NULL).
- `bundle_items`: join table mapping each bundle to its component products with position.
- `reviews`: genuine customer reviews (rating, title, body, name, approved flag).
  Seeded empty - no fabricated testimonials.
- `content_blocks`: editable homepage/site content keyed by section (hero, brand story,
  philosophy, routine, faqs, banners, gallery), each a jsonb payload the owner can edit.
- `newsletter_signups`: email addresses from the subscribe form.

2. Security
- Enable RLS on every table.
- Catalogue and content are intentionally public read: SELECT granted to anon +
  authenticated with USING (true) policies.
- Writes (INSERT/UPDATE/DELETE) on catalogue/content are restricted to service_role only
  (owner manages data; storefront is read-only). No anon/authenticated write grants.
- `newsletter_signups`: anon + authenticated may INSERT email only (column-restricted
  grant); SELECT/UPDATE/DELETE service_role only.
- No user data, no auth.uid() usage: single-tenant public storefront.

3. Data
- Seeds the 7 approved products at temporary PKR 1,999 (price_approved=false, marked
  temporary), the 3 approved bundles with exact compositions and NULL prices, and
  default content blocks. No invented ingredients, claims, or bundle prices.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'serum',
  price_pkr integer NOT NULL,
  price_approved boolean NOT NULL DEFAULT false,
  stock integer NOT NULL DEFAULT 25,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  short_intro text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  ingredients text,
  how_to_use text,
  details jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  featured boolean NOT NULL DEFAULT false,
  community_favourite boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  price_pkr integer,
  price_approved boolean NOT NULL DEFAULT false,
  stock integer NOT NULL DEFAULT 15,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  short_intro text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundle_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  position integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id text PRIMARY KEY,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle ON bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON products, bundles, bundle_items, reviews, content_blocks TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON products, bundles, bundle_items, reviews, content_blocks TO service_role;
GRANT INSERT (email) ON newsletter_signups TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON newsletter_signups TO service_role;

DROP POLICY IF EXISTS "public read products" ON products;
CREATE POLICY "public read products" ON products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public read bundles" ON bundles;
CREATE POLICY "public read bundles" ON bundles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public read bundle items" ON bundle_items;
CREATE POLICY "public read bundle items" ON bundle_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public read reviews" ON reviews;
CREATE POLICY "public read reviews" ON reviews FOR SELECT TO anon, authenticated USING (approved = true);
DROP POLICY IF EXISTS "public read content" ON content_blocks;
CREATE POLICY "public read content" ON content_blocks FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public insert newsletter" ON newsletter_signups;
CREATE POLICY "public insert newsletter" ON newsletter_signups FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO products (slug, name, category, price_pkr, price_approved, images, short_intro, description, ingredients, how_to_use, details, faqs, featured, community_favourite, display_order) VALUES
  ('hydrating-face-toner', 'Hydrating Face Toner', 'toner', 1999, false, '[]'::jsonb,
   'A daily hydration step that refreshes and preps the skin. [Owner-approved copy to follow.]',
   '', NULL, NULL, '[]'::jsonb, '[]'::jsonb, true, false, 1),
  ('salicylic-acid-toner', 'Salicylic Acid Toner', 'toner', 1999, false, '[]'::jsonb,
   'A clarifying toner formulated with salicylic acid. [Owner-approved copy to follow.]',
   '', NULL, NULL, '[]'::jsonb, '[]'::jsonb, true, false, 2),
  ('niacinamide-serum', 'Niacinamide Serum', 'serum', 1999, false, '[]'::jsonb,
   'A concentrated niacinamide serum for a balanced, even-looking complexion.',
   '', NULL, NULL, '[]'::jsonb, '[]'::jsonb, true, true, 3),
  ('hyaluronic-acid-serum', 'Hyaluronic Acid Serum', 'serum', 1999, false, '[]'::jsonb,
   'A hydration-focused serum that leaves skin feeling plump and comfortable.',
   '', NULL, NULL, '[]'::jsonb, '[]'::jsonb, true, true, 4),
  ('glutathione-serum', 'Glutathione Serum', 'serum', 1999, false, '[]'::jsonb,
   'A brightening-focused serum featuring glutathione.',
   '', NULL, NULL, '[]'::jsonb, '[]'::jsonb, true, false, 5),
  ('retinol-05-serum', 'Retinol 0.5% Serum', 'serum', 1999, false, '[]'::jsonb,
   'A 0.5% retinol serum for an evening renewal step in your routine.',
   '', NULL, NULL, '[]'::jsonb, '[]'::jsonb, true, false, 6),
  ('vitamin-c-serum', 'Vitamin C Serum', 'serum', 1999, false, '[]'::jsonb,
   'A vitamin C serum that supports a fresh, radiant appearance.',
   '', NULL, NULL, '[]'::jsonb, '[]'::jsonb, true, true, 7)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO bundles (slug, name, price_pkr, price_approved, images, short_intro, description, display_order) VALUES
  ('hydrating-bundle', 'Hydrating Bundle', NULL, false, '[]'::jsonb,
   'Deep, comfortable hydration in two steps.',
   '', 1),
  ('oil-clear-solution', 'Oil Clear Solution', NULL, false, '[]'::jsonb,
   'A targeted trio for oily and blemish-prone skin.',
   '', 2),
  ('brightening-bundle', 'Brightening Bundle', NULL, false, '[]'::jsonb,
   'A radiant-focused pairing for dull, tired skin.',
   '', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO bundle_items (bundle_id, product_id, position)
SELECT b.id, p.id, v.position
FROM (VALUES
  ('hydrating-bundle', 'hydrating-face-toner', 1),
  ('hydrating-bundle', 'hyaluronic-acid-serum', 2),
  ('oil-clear-solution', 'niacinamide-serum', 1),
  ('oil-clear-solution', 'retinol-05-serum', 2),
  ('oil-clear-solution', 'salicylic-acid-toner', 3),
  ('brightening-bundle', 'glutathione-serum', 1),
  ('brightening-bundle', 'vitamin-c-serum', 2)
) AS v(bundle_slug, product_slug, position)
JOIN bundles b ON b.slug = v.bundle_slug
JOIN products p ON p.slug = v.product_slug
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items bi
  WHERE bi.bundle_id = b.id AND bi.product_id = p.id
);

INSERT INTO content_blocks (id, payload) VALUES
  ('hero', '{"headline": "Refined Skincare, Made for Pakistan", "subheading": "Seven considered formulas — toners and serums that bring quiet, effective care to your daily routine.", "image": null}'::jsonb),
  ('banner', '{"image": null, "alt": "VELEURA promotional banner"}'::jsonb),
  ('brand_story', '{"heading": "The VELEURA Story", "body": "VELEURA began with a simple belief: skincare should feel considered, calm and genuine. [Owner-approved brand introduction to follow.]", "image": null}'::jsonb),
  ('philosophy', '{"heading": "Our Product Philosophy", "items": ["Formulas built on well-studied, purposeful ingredients.", "Transparent information, clearly approved by our team.", "Quality at every step, from sourcing to packaging.", "Made available across Pakistan with care."]}'::jsonb),
  ('routine', '{"heading": "Build Your Routine", "body": "Answer a few simple questions and we will suggest VELEURA products that fit your skin and your day."}'::jsonb),
  ('concerns', '{"items": [{"label": "Hydration", "image": null}, {"label": "Oil & Blemishes", "image": null}, {"label": "Radiance", "image": null}, {"label": "Even Tone", "image": null}]}'::jsonb),
  ('gallery', '{"items": [null, null, null, null, null, null]}'::jsonb),
  ('faqs', '{"items": [{"q": "Do you deliver across Pakistan?", "a": "Yes. VELEURA delivers nationwide. Free shipping applies when your eligible product total is greater than PKR 5,000."}, {"q": "What payment methods can I use?", "a": "We plan to support Cash on Delivery, JazzCash, Easypaisa, and debit/credit cards. Payments are being finalised and will be enabled soon."}, {"q": "When does free shipping apply?", "a": "When the eligible product total is strictly greater than PKR 5,000 — totals of PKR 5,000 or less do not qualify."}, {"q": "Are bundle prices live?", "a": "Not yet. Bundle prices will appear once they are approved."}]}'::jsonb),
  ('contact', '{"email": null, "phone": null, "social": {"instagram": null, "facebook": null, "tiktok": null}}'::jsonb)
ON CONFLICT (id) DO NOTHING;
