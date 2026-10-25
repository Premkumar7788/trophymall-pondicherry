import { Product } from '@/types';
import { PRODUCTS } from '@/data/catalog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const STORAGE_KEY = 'trophymall_catalog_products';
const INQUIRIES_KEY = 'trophymall_customer_inquiries';

export interface StoredInquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  organizationName?: string;
  productName?: string;
  quantity: number;
  engravingLine1?: string;
  engravingLine2?: string;
  fulfillmentType: 'pickup' | 'delivery';
  eventDate?: string;
  createdAt: string;
}

/**
 * Retrieve current active products:
 * 1. From localStorage if customized
 * 2. Fall back to default catalog PRODUCTS
 */
export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored products:', e);
  }
  return PRODUCTS;
}

/**
 * Save updated products to localStorage (and Supabase if configured)
 */
export async function saveStoredProducts(products: Product[]): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('catalog-updated'));
  }

  // If Supabase is configured, also persist changes
  if (isSupabaseConfigured && supabase) {
    try {
      // upsert products into Supabase
      const payload = products.map((p) => ({
        id: p.id.includes('-') && p.id.length > 30 ? p.id : undefined,
        name: p.name,
        slug: p.slug,
        base_price: p.basePrice,
        mrp: p.mrp,
        material: p.material,
        height_inches: p.heightInches,
        description: p.description,
        images: p.images,
        is_customizable: p.isCustomizable,
        is_bestseller: p.isBestseller,
        stock_status: p.stockStatus,
      }));

      await supabase.from('products').upsert(payload);
    } catch (err) {
      console.warn('Supabase products sync note:', err);
    }
  }

  return true;
}

/**
 * Reset catalog back to factory defaults
 */
export function resetStoredProducts(): Product[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('catalog-updated'));
  }
  return PRODUCTS;
}

/**
 * Get customer inquiries list
 */
export async function getStoredInquiries(): Promise<StoredInquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('order_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((d: Record<string, unknown>) => ({
          id: String(d.id || ''),
          customerName: String(d.customer_name || ''),
          customerPhone: String(d.customer_phone || ''),
          customerEmail: d.customer_email ? String(d.customer_email) : undefined,
          organizationName: d.organization_name ? String(d.organization_name) : undefined,
          productName: d.engraving_line1 ? String(d.engraving_line1) : undefined,
          quantity: Number(d.quantity) || 1,
          engravingLine1: d.engraving_line1 ? String(d.engraving_line1) : undefined,
          engravingLine2: d.engraving_line2 ? String(d.engraving_line2) : undefined,
          fulfillmentType: (d.fulfillment_type as 'pickup' | 'delivery') || 'pickup',
          eventDate: d.event_date ? String(d.event_date) : undefined,
          createdAt: String(d.created_at || ''),
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch inquiries note:', e);
    }
  }

  // Fallback to local
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(INQUIRIES_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }
  }
  return [];
}

/**
 * Helper to parse a CSV line respecting quotes
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Determine category slug from name or category column
 */
function detectCategory(title: string, rawCategory?: string): { slug: string; id: string } {
  const text = `${title} ${rawCategory || ''}`.toLowerCase();

  if (text.includes('cricket') || text.includes('bat') || text.includes('ball') || text.includes('wicket')) {
    return { slug: 'cricket', id: 'cat-cricket' };
  }
  if (text.includes('football') || text.includes('boot') || text.includes('badminton') || text.includes('sports') || text.includes('run') || text.includes('athletics')) {
    return { slug: 'sports', id: 'cat-sports' };
  }
  if (text.includes('acrylic') || text.includes('crystal') || text.includes('corporate') || text.includes('star')) {
    return { slug: 'corporate-acrylic', id: 'cat-acrylic' };
  }
  if (text.includes('medal') || text.includes('ribbon') || text.includes('lanyard') || text.includes('badge')) {
    return { slug: 'medals', id: 'cat-medals' };
  }
  if (text.includes('big') || text.includes('rolling') || text.includes('championship') || text.includes('cup') || text.includes('feet') || text.includes('mega')) {
    return { slug: 'championship-cups', id: 'cat-mega' };
  }
  if (text.includes('crest') || text.includes('wooden') || text.includes('memento') || text.includes('plaque') || text.includes('shield')) {
    return { slug: 'mementos-crests', id: 'cat-mementos' };
  }

  return { slug: 'cricket', id: 'cat-cricket' };
}

/**
 * Clean price string into a valid number (e.g. "450 INR", "₹450.00", "450")
 */
function cleanPrice(raw: string): number {
  if (!raw) return 450;
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) || parsed <= 0 ? 450 : Math.round(parsed);
}

/**
 * Parse WhatsApp Business Catalog / Meta Commerce CSV export
 */
export function parseWhatsAppCSV(csvContent: string): { products: Product[]; errors: string[] } {
  const errors: string[] = [];
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return { products: [], errors: ['CSV file is empty or missing data rows.'] };
  }

  // Parse Header
  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[\s_-]+/g, ''));

  // Common WhatsApp / Meta Commerce column aliases
  const titleIdx = headers.findIndex((h) => ['title', 'name', 'productname', 'itemname'].includes(h));
  const priceIdx = headers.findIndex((h) => ['price', 'baseprice', 'unitprice', 'cost'].includes(h));
  const mrpIdx = headers.findIndex((h) => ['saleprice', 'mrp', 'originalprice', 'regularprice'].includes(h));
  const descIdx = headers.findIndex((h) => ['description', 'desc', 'details'].includes(h));
  const imgIdx = headers.findIndex((h) => ['imagelink', 'imageurl', 'image', 'images', 'photo'].includes(h));
  const catIdx = headers.findIndex((h) => ['category', 'googleproductcategory', 'productcategory', 'type'].includes(h));
  const idIdx = headers.findIndex((h) => ['id', 'retailerid', 'sku', 'productid'].includes(h));
  const availIdx = headers.findIndex((h) => ['availability', 'stock', 'stockstatus'].includes(h));

  if (titleIdx === -1) {
    return {
      products: [],
      errors: ['Could not find a Title/Name column in the CSV. Header must include "title" or "name".'],
    };
  }

  const parsedProducts: Product[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (!row || row.length === 0 || !row[titleIdx]) continue;

    const title = row[titleIdx];
    const rawPrice = priceIdx !== -1 ? row[priceIdx] : '450';
    const basePrice = cleanPrice(rawPrice);
    const rawMrp = mrpIdx !== -1 ? row[mrpIdx] : '';
    const mrp = rawMrp ? cleanPrice(rawMrp) : Math.round(basePrice * 1.35);
    const description = (descIdx !== -1 && row[descIdx]) 
      ? row[descIdx] 
      : `${title} available with free custom laser plate engraving at Trophy Mall Pondicherry.`;
    
    let imageUrl = (imgIdx !== -1 && row[imgIdx]) ? row[imgIdx].trim() : '';
    if (!imageUrl || !imageUrl.startsWith('http')) {
      // default placeholder image
      imageUrl = 'https://trophymall.shop/wp-content/uploads/2026/08/Sports-Trophies-Cover-768x768.png';
    }

    const rawCategory = catIdx !== -1 ? row[catIdx] : '';
    const detected = detectCategory(title, rawCategory);

    const rawId = (idIdx !== -1 && row[idIdx]) ? row[idIdx] : `wa-${Date.now()}-${i}`;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `trophy-${i}`;

    const availability = availIdx !== -1 && row[availIdx] ? row[availIdx].toLowerCase() : 'in stock';
    const stockStatus = availability.includes('out') ? 'made_to_order' : 'in_stock';

    parsedProducts.push({
      id: rawId,
      categoryId: detected.id,
      categorySlug: detected.slug,
      name: title,
      slug: `${slug}-${i}`,
      basePrice,
      mrp,
      material: title.toLowerCase().includes('acrylic') 
        ? 'Acrylic' 
        : title.toLowerCase().includes('wood') 
        ? 'Wood' 
        : 'Metal & Fiber',
      heightInches: '12 inch',
      heightOptions: ['10 inch', '12 inch', '15 inch'],
      description,
      images: [imageUrl],
      isCustomizable: true,
      isBestseller: i <= 3,
      isExpress24h: true,
      stockStatus,
      bulkPricing: [
        { minQty: 10, maxQty: 19, discountPercent: 10 },
        { minQty: 20, maxQty: 49, discountPercent: 15 },
        { minQty: 50, discountPercent: 25 },
      ],
    });
  }

  if (parsedProducts.length === 0) {
    errors.push('No valid products could be parsed from the provided CSV file.');
  }

  return { products: parsedProducts, errors };
}

/**
 * Generate a sample CSV string for WhatsApp Business Catalog format
 */
export function generateSampleWhatsAppCSV(): string {
  return `id,title,description,availability,condition,price,sale_price,image_link,category
TM-001,Pondicherry Premier Gold Cricket Trophy,"Showcase gold plated cricket cup with batsman crest on walnut wooden base.",in stock,new,450 INR,650 INR,https://trophymall.shop/wp-content/uploads/2024/07/E1-23-800x800.webp,Cricket Trophies
TM-002,All-Rounder Man of the Match Star Trophy,"Electroplated duo-tone cricket player figure framed by victory stars.",in stock,new,380 INR,520 INR,https://trophymall.shop/wp-content/uploads/2024/07/A1-24-800x800.webp,Cricket Trophies
TM-003,Golden Boot Football Tournament Trophy,"Solid metallic gold football shoe on emerald turf accent base.",in stock,new,550 INR,790 INR,https://trophymall.shop/wp-content/uploads/2024/07/E2-16-768x768.webp,Football & Sports
TM-004,Custom Die-Cast School & Sports Medals,"Zinc alloy die-cast medals with 3D embossed border and neck lanyard.",in stock,new,65 INR,110 INR,https://trophymall.shop/wp-content/uploads/2026/10/Badge-of-Pride-800x800.jpeg,Medals & Lanyards
TM-005,Prism Laser Acrylic Corporate Award,"12mm optical acrylic with diamond-polished edges and laser frost etching.",in stock,new,650 INR,950 INR,https://trophymall.shop/wp-content/uploads/2025/01/D2-6-800x800.webp,Corporate & Acrylic
TM-006,Imperial Grand 3-Foot Rolling Championship Cup,"Monumental tournament trophy with ornate brass handles and mahogany tower.",in stock,new,3800 INR,5200 INR,https://trophymall.shop/wp-content/uploads/2026/08/Big-Trophy-Cover.png,Mega Championship Cups`;
}
