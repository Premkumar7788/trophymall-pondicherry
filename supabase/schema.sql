-- ==============================================================================
-- TROPHY MALL PONDICHERRY - SUPABASE DATABASE SCHEMA
-- Physical Showroom: 76, 1st Floor, Lawspet, Airport Road, Rajaji Nagar, Puducherry
-- Benchmark: https://trophymall.shop
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon_name VARCHAR(50),
    description TEXT,
    display_order INT DEFAULT 0
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    base_price NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2), -- Original price for discount badge calculation
    material VARCHAR(100) NOT NULL, -- 'Metal', 'Acrylic', 'Wood', 'Crystal', 'Fiber'
    height_inches VARCHAR(50), -- e.g., '10 inch', '14 inch', '18 inch', '2 Feet', '3 Feet'
    description TEXT,
    images TEXT[] NOT NULL DEFAULT '{}',
    is_customizable BOOLEAN DEFAULT TRUE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    stock_status VARCHAR(50) DEFAULT 'in_stock', -- 'in_stock', 'made_to_order'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bulk Tier Pricing (B2B School/Tournament discounts)
CREATE TABLE IF NOT EXISTS bulk_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    min_quantity INT NOT NULL,
    max_quantity INT, -- NULL means 'or more'
    discounted_price NUMERIC(10, 2) NOT NULL
);

-- 5. Store Inquiries & Custom Proof Requests
CREATE TABLE IF NOT EXISTS order_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(150),
    organization_name VARCHAR(200),
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL DEFAULT 1,
    engraving_line1 TEXT,
    engraving_line2 TEXT,
    logo_storage_url TEXT,
    event_date DATE,
    fulfillment_type VARCHAR(50) DEFAULT 'pickup', -- 'pickup', 'delivery'
    status VARCHAR(50) DEFAULT 'pending_review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public read access for catalog
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public pricing is viewable by everyone" ON bulk_pricing;
CREATE POLICY "Public pricing is viewable by everyone" ON bulk_pricing FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can submit inquiries" ON order_inquiries;
CREATE POLICY "Public can submit inquiries" ON order_inquiries FOR INSERT WITH CHECK (true);

-- Storage bucket creation instructions:
-- In Supabase Dashboard -> Storage -> Create bucket: 'trophy-catalog' (Public)
-- Create bucket: 'customer-logos' (Public upload for proofs)

-- ==============================================================================
-- SEED DATA: CATEGORIES
-- ==============================================================================
INSERT INTO categories (id, name, slug, icon_name, description, display_order)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Cricket Trophies', 'cricket', 'Trophy', 'Pondicherry league trophies, batsman, bowler, man-of-the-match awards.', 1),
    ('c2222222-2222-2222-2222-222222222222', 'Football & Sports', 'sports', 'Activity', 'Tournaments, Golden Boot, badminton, athletics, chess & beach sports awards.', 2),
    ('c3333333-3333-3333-3333-333333333333', 'Corporate & Acrylic', 'corporate-acrylic', 'Award', 'Laser-cut acrylic plaques, star performers, milestone honours & executive gifts.', 3),
    ('c4444444-4444-4444-4444-444444444444', 'Medals & Lanyards', 'medals', 'Medal', 'Gold, Silver & Bronze die-cast medals with customized school ribbon lanyards.', 4),
    ('c5555555-5555-5555-5555-555555555555', 'Mega Championship Cups', 'championship-cups', 'Crown', 'Large 2 to 5 feet rolling trophies for university, state & club tournaments.', 5),
    ('c6666666-6666-6666-6666-666666666666', 'Mementos & Wooden Crests', 'mementos-crests', 'Shield', 'Chief guest mementos, college graduation shields & traditional brass crests.', 6)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- SEED DATA: PRODUCTS
-- ==============================================================================
INSERT INTO products (id, category_id, name, slug, base_price, mrp, material, height_inches, description, images, is_customizable, is_bestseller, stock_status)
VALUES
    (
        'p1111111-1111-1111-1111-111111111111',
        'c1111111-1111-1111-1111-111111111111',
        'Pondicherry Premier Gold Cricket Trophy',
        'pondicherry-premier-cricket-trophy',
        450.00,
        650.00,
        'Metal & Fiber',
        '14 inch',
        'Showcase gold plated cricket cup with batsman crest, heavy wooden base, and free laser-engraved brass plate.',
        ARRAY['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80'],
        true,
        true,
        'in_stock'
    ),
    (
        'p2222222-2222-2222-2222-222222222222',
        'c1111111-1111-1111-1111-111111111111',
        'All-Rounder Cricket Star Award',
        'all-rounder-cricket-star-award',
        380.00,
        520.00,
        'Metal',
        '12 inch',
        'Modern electroplated metallic finish with cricket bat and ball emblem, ideal for Man of the Match awards.',
        ARRAY['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'],
        true,
        true,
        'in_stock'
    ),
    (
        'p3333333-3333-3333-3333-333333333333',
        'c2222222-2222-2222-2222-222222222222',
        'Golden Boot Football Tournament Trophy',
        'golden-boot-football-trophy',
        550.00,
        790.00,
        'Metal & Resin',
        '13 inch',
        'Solid metallic gold shoe figurine on dark obsidian base. Top scorer choice for Puducherry football & futsal leagues.',
        ARRAY['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'],
        true,
        false,
        'in_stock'
    ),
    (
        'p4444444-4444-4444-4444-444444444444',
        'c2222222-2222-2222-2222-222222222222',
        'Ace Shuttle Badminton Championship Trophy',
        'ace-shuttle-badminton-trophy',
        420.00,
        580.00,
        'Metal',
        '11 inch',
        'Dynamic shuttlecock swing frame with high-gloss gold/silver dual finish. Ideal for singles & doubles tournaments.',
        ARRAY['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'],
        true,
        false,
        'in_stock'
    ),
    (
        'p5555555-5555-5555-5555-555555555555',
        'c3333333-3333-3333-3333-333333333333',
        'Prism Laser Acrylic Corporate Award',
        'prism-laser-acrylic-corporate-award',
        650.00,
        950.00,
        'Acrylic',
        '9 inch',
        'Ultra-clear 12mm beveled optical acrylic with precision UV color printing or frost engraving. Modern corporate look.',
        ARRAY['https://images.unsplash.com/photo-1569420061962-d2279148b534?auto=format&fit=crop&w=800&q=80'],
        true,
        true,
        'in_stock'
    ),
    (
        'p6666666-6666-6666-6666-666666666666',
        'c3333333-3333-3333-3333-333333333333',
        'Crystal Star Excellence Honor Trophy',
        'crystal-star-excellence-trophy',
        980.00,
        1400.00,
        'Crystal',
        '10 inch',
        'K9 optical heavy crystal column topped with an engraved multi-faceted star. Packed in velvet luxury gift box.',
        ARRAY['https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'],
        true,
        false,
        'in_stock'
    ),
    (
        'p7777777-7777-7777-7777-777777777777',
        'c4444444-4444-4444-4444-444444444444',
        'Custom Die-Cast School Medal (Gold/Silver/Bronze)',
        'custom-die-cast-school-medal',
        65.00,
        110.00,
        'Metal',
        '2.5 inch',
        'Heavy zinc alloy medal with customized school/college crest and satin tri-color neck lanyard. Bulk discounts up to 40%.',
        ARRAY['https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80'],
        true,
        true,
        'in_stock'
    ),
    (
        'p8888888-8888-8888-8888-888888888888',
        'c5555555-5555-5555-5555-555555555555',
        'Imperial Grand 3-Foot Rolling Championship Cup',
        'imperial-grand-3ft-rolling-cup',
        3800.00,
        5200.00,
        'Metal & Wood',
        '3 Feet',
        'Grand tournament rolling trophy with multi-tiered polished mahogany wooden tower, brass handles and crown lid.',
        ARRAY['https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&w=800&q=80'],
        true,
        true,
        'in_stock'
    ),
    (
        'p9999999-9999-9999-9999-999999999999',
        'c6666666-6666-6666-6666-666666666666',
        'Pondicherry Heritage Wooden Crest Memento',
        'heritage-wooden-crest-memento',
        520.00,
        750.00,
        'Wood & Brass',
        '8x10 inch',
        'Dark polished teak finish plaque with brushed gold laser etched plate. Favorite for Chief Guests and University dignitaries.',
        ARRAY['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80'],
        true,
        false,
        'in_stock'
    )
ON CONFLICT (slug) DO NOTHING;

-- Bulk Pricing rules
INSERT INTO bulk_pricing (product_id, min_quantity, max_quantity, discounted_price)
VALUES
    ('p1111111-1111-1111-1111-111111111111', 10, 19, 405.00),
    ('p1111111-1111-1111-1111-111111111111', 20, 49, 382.50),
    ('p1111111-1111-1111-1111-111111111111', 50, NULL, 337.50),
    ('p7777777-7777-7777-7777-777777777777', 25, 49, 58.00),
    ('p7777777-7777-7777-7777-777777777777', 50, 99, 52.00),
    ('p7777777-7777-7777-7777-777777777777', 100, NULL, 45.00)
ON CONFLICT DO NOTHING;
