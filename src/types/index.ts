export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  categorySlug: string;
  name: string;
  slug: string;
  basePrice: number;
  mrp: number;
  material:
    | 'Metal'
    | 'Acrylic'
    | 'Wood'
    | 'Crystal'
    | 'Fiber'
    | 'Brass'
    | 'Metal & Wood'
    | 'Metal & Fiber'
    | 'Wood & Brass'
    | 'Resin'
    | string;
  heightInches: string;
  heightOptions: string[];
  description: string;
  images: string[];
  isCustomizable: boolean;
  isBestseller: boolean;
  isExpress24h?: boolean;
  stockStatus: 'in_stock' | 'made_to_order';
  bulkPricing?: {
    minQty: number;
    maxQty?: number;
    discountPercent: number;
  }[];
}

export interface CustomizationDetails {
  selectedHeight: string;
  quantity: number;
  line1: string; // Header / Event Name
  line2: string; // Award Title / Category
  line3: string; // Recipient Name / Year
  logoUrl?: string;
  logoFileName?: string;
  fulfillment: 'pickup' | 'delivery';
  eventDate?: string;
  customerName?: string;
  customerPhone?: string;
  organizationName?: string;
}

export interface QuoteItem {
  product: Product;
  customization: CustomizationDetails;
  unitPrice: number;
  totalPrice: number;
}
