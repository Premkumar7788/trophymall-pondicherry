# 🏆 Trophy Mall Pondicherry Web Platform

> Production-ready, 100% free-tier open-source e-commerce catalog, dynamic WhatsApp proof customization engine, and institutional quotation generator for **Trophy Mall Pondicherry**.

---

## 📍 Business Context & Physical Showroom Integration

* **Showroom Name:** Trophy Mall Pondicherry
* **Address:** 76, 1st Floor, Lawspet, Airport Road, Rajaji Nagar, Puducherry - 605008
* **Landmark:** Opp. Rajaji Nagar Main Arch, Near Lawspet Airport Road Junction
* **Direct Google Maps Link:** [https://maps.app.goo.gl/Gfa6i4hKN1KhHZqt6](https://maps.app.goo.gl/Gfa6i4hKN1KhHZqt6)
* **Google Maps Share Link:** [https://share.google/LPRtlWKV5kPvElf0C](https://share.google/LPRtlWKV5kPvElf0C)
* **Showroom Hours:** Monday – Saturday: 10:00 AM – 9:00 PM | Sunday: Tournament Emergency Pickups
* **Phone / Hotline:** `+91 94432 12345` (Configurable in `.env.local`)
* **Benchmark Platform:** `https://trophymall.shop`

---

## 🌟 Key Features

1. **Physical Showroom Click & Collect:**
   * Pondicherry institutions and local tournament organizers can inspect physical samples in Lawspet and pick up engraved awards on-the-spot.
   * Regional delivery supported to Lawspet, Muthialpet, Reddiarpalayam, Villianur, Kalapet, Auroville, Cuddalore, and Villupuram.

2. **Live Interactive Plaque Simulator:**
   * Real-time preview of the brushed brass laser-engraved plate directly as customers type Line 1 (Event Name), Line 2 (Award Title), and Line 3 (Recipient / Date).
   * Instant logo upload and emblem rendering with client preview.

3. **Dynamic WhatsApp Inquiry & Conversion Engine:**
   * Encodes all customization parameters (Height, Quantity, Engraving lines, Fulfillment choice, Event date, Savings) into pre-formatted WhatsApp URLs.
   * Allows customers to receive digital artwork proofs on WhatsApp within 15 minutes before physical production begins.

4. **Institutional Printable Quotation Generator:**
   * One-click PDF / Print estimate generator formatted with official Trophy Mall Pondicherry letterhead, estimate reference number, line items, bulk discounts, and authorized signatory blocks.
   * Built specifically for school principals, SMVEC, Pondicherry University, JIPMER, PEC, and corporate purchase committees.

5. **Tiered Bulk Pricing Formula:**
   * Dynamic calculations: 10+ units (10% OFF), 20+ units (15% OFF), 50+ units (25% OFF).
   * Visual badge displaying live rupee savings.

6. **100% Free & Open-Source Stack:**
   * **Frontend:** Next.js 14 App Router + TypeScript + Tailwind CSS + Lucide Icons
   * **Database:** Supabase (Free tier managed PostgreSQL with RLS policies)
   * **Hosting:** Vercel / Cloudflare Pages (Zero hosting costs, continuous deployment with SSL)

---

## 📁 Project Architecture

```
trophymall-pondicherry/
├── supabase/
│   └── schema.sql                # Complete PostgreSQL DDL, RLS policies & seed data
├── src/
│   ├── app/
│   │   ├── globals.css           # Custom scrollbars, theme colors & print styles
│   │   ├── layout.tsx            # SEO metadata, OpenGraph tags & fonts
│   │   └── page.tsx              # Main homepage & interactive modal state
│   ├── components/
│   │   ├── Header.tsx            # Top notice, brand crest, quick links & quote counter
│   │   ├── Hero.tsx              # Hero headline, trust badges & showroom proof card
│   │   ├── ShowroomHighlights.tsx# 4 core showroom pillars
│   │   ├── CategoryTabs.tsx      # Fast filter tabs with live inventory counts
│   │   ├── ProductCatalog.tsx    # Search, material filtering, price sorting & grid
│   │   ├── ProductCard.tsx       # Bestseller / 24h Express badges, pricing & actions
│   │   ├── ProductCustomizerModal.tsx # Live plaque simulator & WhatsApp URL builder
│   │   ├── QuoteModal.tsx        # Printable official quotation letterhead
│   │   ├── InstitutionalTenderForm.tsx # B2B bulk inquiry form
│   │   ├── ShowroomSection.tsx   # Google Maps embed, address & coverage areas
│   │   └── Footer.tsx            # Showroom details & floating WhatsApp quick trigger
│   ├── data/
│   │   └── catalog.ts            # Rich catalog data, store details & local institutions
│   ├── lib/
│   │   └── supabase.ts           # Supabase client with graceful offline fallback
│   └── types/
│       └── index.ts              # TypeScript schemas for awards, quotes & customization
├── .env.example                  # Environment variable blueprint
├── .env.local                    # Local configuration
├── next.config.mjs               # Remote image optimization configuration
└── tailwind.config.ts            # Trophy gold & amber branding palette
```

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
* Node.js v18.17+ or v20+
* npm or pnpm or yarn

### 2. Install & Run
```bash
# Navigate to project folder
cd trophymall-pondicherry

# Install dependencies (if not already installed)
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup (Free Tier)

1. Sign up for a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy and run the entire contents of `supabase/schema.sql`.
4. Retrieve your **Project URL** and **anon public key** from `Settings` -> `API`.
5. Update your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SHOP_WHATSAPP=919443212345
   NEXT_PUBLIC_STORE_MAPS_LINK=https://maps.app.goo.gl/Gfa6i4hKN1KhHZqt6
   ```

*(Note: If Supabase keys are left blank, the application will automatically run seamlessly using local catalog data and client-side quotation generation!)*

---

## 🌐 Zero-Cost Vercel Deployment Protocol

1. **Commit to GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete Trophy Mall Pondicherry platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/trophymall-pondicherry.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   * Go to [vercel.com/new](https://vercel.com/new).
   * Import the `trophymall-pondicherry` repository.
   * Add the Environment Variables under **Settings -> Environment Variables**:
     * `NEXT_PUBLIC_SHOP_WHATSAPP`
     * `NEXT_PUBLIC_STORE_MAPS_LINK`
     * `NEXT_PUBLIC_SUPABASE_URL` (optional)
     * `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
   * Click **Deploy**. Vercel will build and assign your free live domain (e.g., `https://trophymall-pondicherry.vercel.app`).

3. **Google Business Profile Integration:**
   * Open your Google Business Profile manager for **Trophy Mall Pondicherry**.
   * Set your deployed Vercel domain in the **Website** link.
   * Set the direct WhatsApp link under the **Order Ahead / Message** link.

---

## 📞 Showroom Contacts & Support
* **Trophy Mall Pondicherry**
* 76, 1st Floor, Lawspet, Airport Road, Rajaji Nagar, Puducherry - 605008
* Direct Link: `https://maps.app.goo.gl/Gfa6i4hKN1KhHZqt6`
