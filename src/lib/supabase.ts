import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * Helper to record an inquiry into Supabase if configured,
 * or log locally for offline preview.
 */
export async function submitOrderInquiry(inquiryData: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  organizationName?: string;
  productId?: string;
  quantity: number;
  engravingLine1?: string;
  engravingLine2?: string;
  logoStorageUrl?: string;
  eventDate?: string;
  fulfillmentType: 'pickup' | 'delivery';
}) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('order_inquiries')
        .insert([
          {
            customer_name: inquiryData.customerName,
            customer_phone: inquiryData.customerPhone,
            customer_email: inquiryData.customerEmail,
            organization_name: inquiryData.organizationName,
            product_id: inquiryData.productId,
            quantity: inquiryData.quantity,
            engraving_line1: inquiryData.engravingLine1,
            engraving_line2: inquiryData.engravingLine2,
            logo_storage_url: inquiryData.logoStorageUrl,
            event_date: inquiryData.eventDate,
            fulfillment_type: inquiryData.fulfillmentType,
            status: 'pending_review',
          },
        ])
        .select();

      if (error) {
        console.warn('Supabase submission warning:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err: unknown) {
      console.warn('Supabase network error:', err);
      return { success: false, error: (err as Error).message };
    }
  }

  // Fallback demo log
  console.info('Local fallback: Inquiry captured (Supabase credentials not configured in .env.local):', inquiryData);
  return { success: true, fallback: true };
}
