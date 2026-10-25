'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  MessageSquare, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  Trash2, 
  FileText, 
  Check, 
  Truck
} from 'lucide-react';
import { Product, CustomizationDetails } from '@/types';
import { STORE_INFO } from '@/data/catalog';
import { submitOrderInquiry } from '@/lib/supabase';

interface ProductCustomizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToQuote?: (customization: CustomizationDetails, unitPrice: number, totalPrice: number) => void;
  onGenerateDirectQuote?: (customization: CustomizationDetails, unitPrice: number, totalPrice: number) => void;
}

export default function ProductCustomizerModal({
  product,
  isOpen,
  onClose,
  onAddToQuote,
  onGenerateDirectQuote,
}: ProductCustomizerModalProps) {
  const [selectedHeight, setSelectedHeight] = useState(
    product?.heightOptions && product.heightOptions.length > 0
      ? product.heightOptions[0]
      : product?.heightInches || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [line3, setLine3] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [eventDate, setEventDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected height when product changes
  useEffect(() => {
    if (product) {
      setSelectedHeight(
        product.heightOptions && product.heightOptions.length > 0
          ? product.heightOptions[0]
          : product.heightInches
      );
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Dynamic Tier Pricing Formula
  const getUnitPrice = (qty: number) => {
    if (qty >= 50) return Math.round(product.basePrice * 0.75); // 25% off
    if (qty >= 20) return Math.round(product.basePrice * 0.85); // 15% off
    if (qty >= 10) return Math.round(product.basePrice * 0.90); // 10% off
    return product.basePrice;
  };

  const unitPrice = getUnitPrice(quantity);
  const totalPrice = unitPrice * quantity;
  const standardTotal = product.basePrice * quantity;
  const savings = standardTotal - totalPrice;
  const discountPercent = Math.round(((product.basePrice - unitPrice) / product.basePrice) * 100);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleWhatsAppInquiry = async () => {
    setIsSubmitting(true);

    // Attempt to log to Supabase order_inquiries in the background
    try {
      await submitOrderInquiry({
        customerName: customerName || 'WhatsApp Customer',
        customerPhone: customerPhone || 'Via WhatsApp',
        organizationName: organizationName || undefined,
        productId: product.id,
        quantity,
        engravingLine1: line1 || undefined,
        engravingLine2: line2 || undefined,
        eventDate: eventDate || undefined,
        fulfillmentType: fulfillment,
      });
    } catch (e) {
      console.warn('Inquiry logging skipped:', e);
    }

    const message =
      `*TROPHY MALL PONDICHERRY - ORDER INQUIRY*%0A%0A` +
      `🏆 *Item:* ${product.name}%0A` +
      `📏 *Size / Height:* ${selectedHeight}%0A` +
      `🔢 *Quantity:* ${quantity} units%0A` +
      `💰 *Estimated Total:* ₹${totalPrice.toLocaleString('en-IN')} (@ ₹${unitPrice}/unit)%0A` +
      (savings > 0 ? `🏷️ *Bulk Savings:* ₹${savings.toLocaleString('en-IN')} (${discountPercent}% OFF)%0A` : '') +
      `%0A*Personalized Plate Engraving (Free):*%0A` +
      `• Line 1 (Event / Org): ${line1 || 'Will provide on chat'}%0A` +
      `• Line 2 (Award Title): ${line2 || 'Will provide on chat'}%0A` +
      `• Line 3 (Recipient / Date): ${line3 || 'None'}%0A` +
      (logoFileName ? `• Logo: Attached / In Chat (${logoFileName})%0A` : '') +
      `%0A📍 *Fulfillment:* ${
        fulfillment === 'pickup'
          ? 'Showroom Pickup (Lawspet, Pondicherry)'
          : 'Local / Regional Delivery (Pondicherry & Surrounds)'
      }%0A` +
      (eventDate ? `📅 *Event Date:* ${eventDate}%0A` : '') +
      (organizationName ? `🏫 *Institution:* ${organizationName}%0A` : '') +
      (customerName ? `👤 *Contact Name:* ${customerName}%0A` : '') +
      `%0A👉 *Please confirm availability and share WhatsApp artwork design proof.*`;

    const url = `https://wa.me/${STORE_INFO.whatsapp}?text=${message}`;
    window.open(url, '_blank');
    setIsSubmitting(false);
  };

  const handleDirectQuote = () => {
    if (onGenerateDirectQuote) {
      onGenerateDirectQuote(
        {
          selectedHeight,
          quantity,
          line1,
          line2,
          line3,
          logoUrl: logoPreview || undefined,
          logoFileName: logoFileName || undefined,
          fulfillment,
          eventDate,
          customerName,
          customerPhone,
          organizationName,
        },
        unitPrice,
        totalPrice
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <Sparkles size={18} />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Custom Trophy Configurator
              </h3>
              <p className="text-xs text-slate-500">
                Trophy Mall Pondicherry • Free Laser Proof Included
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Product Visuals & Live Plaque Simulator */}
            <div className="lg:col-span-5 space-y-5">
              {/* Product Picture */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 350px"
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-md z-10">
                  {selectedHeight}
                </div>
              </div>

              {/* LIVE BRUSHED BRASS PLAQUE SIMULATOR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    Live Laser Engraving Plaque Preview
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Free Included
                  </span>
                </div>

                <div className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border-2 border-amber-300 rounded-xl p-4 shadow-md text-slate-950 relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] text-center">
                  {/* Screws on Plaque Corners */}
                  <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full border border-amber-500 bg-amber-300 shadow-inner" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-amber-500 bg-amber-300 shadow-inner" />
                  <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full border border-amber-500 bg-amber-300 shadow-inner" />
                  <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full border border-amber-500 bg-amber-300 shadow-inner" />

                  {/* Logo on Plaque */}
                  {logoPreview ? (
                    <div className="mb-2 max-h-10 max-w-[80px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="max-h-10 max-w-[80px] object-contain filter grayscale contrast-200"
                      />
                    </div>
                  ) : (
                    <div className="text-[9px] font-semibold tracking-wider text-amber-800/60 uppercase mb-1">
                      {organizationName || 'Pondicherry Institutional Awards'}
                    </div>
                  )}

                  {/* Text Line 1 */}
                  <div className="text-xs font-black tracking-wider uppercase text-slate-950 max-w-full truncate px-2">
                    {line1 || 'ORGANIZATION / EVENT NAME'}
                  </div>

                  {/* Text Line 2 */}
                  <div className="text-sm font-black tracking-tight text-amber-950 max-w-full truncate px-2">
                    {line2 || 'AWARD TITLE / WINNER'}
                  </div>

                  {/* Text Line 3 */}
                  <div className="text-[11px] font-semibold text-slate-800 italic max-w-full truncate px-2">
                    {line3 || 'Recipient Name / Year'}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  *Rendered in high-contrast black laser etching on brushed gold plate.
                </p>
              </div>

              {/* Showroom Specs */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Material:</span>
                  <span className="font-semibold text-slate-800">{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Showroom Stock:</span>
                  <span className="font-semibold text-emerald-600">Available at Lawspet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Urgent Delivery:</span>
                  <span className="font-semibold text-amber-600">Same-Day / 24h Turnaround</span>
                </div>
              </div>
            </div>

            {/* Right Column: Customization Controls */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Product Title & Base Price */}
              <div>
                <h4 className="text-xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-slate-500">
                    Base: ₹{product.basePrice}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    MRP: ₹{product.mrp}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Free Engraving
                  </span>
                </div>
              </div>

              {/* Height Selection */}
              {product.heightOptions && product.heightOptions.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                    1. Select Height / Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.heightOptions.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setSelectedHeight(h)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedHeight === h
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Engraving Content */}
              <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. Personalized Engraving Text
                  </label>
                  <span className="text-[10px] text-amber-600 font-bold">
                    Included Free
                  </span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Line 1: Organization / Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Pondicherry University Annual Meet 2026"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Line 2: Award Title / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Winner / Best Batsman / Star Performer"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Line 3: Recipient Name / Batch (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., SMVEC Titans / March 2026"
                    value={line3}
                    onChange={(e) => setLine3(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  />
                </div>

                {/* Logo Upload */}
                <div className="pt-2 border-t border-slate-200/80">
                  <label className="text-[11px] text-slate-600 font-medium block mb-1.5">
                    School / Tournament Crest Logo (Optional)
                  </label>
                  
                  {logoPreview ? (
                    <div className="flex items-center justify-between p-2.5 bg-white border border-emerald-300 rounded-xl text-xs text-emerald-800">
                      <div className="flex items-center gap-2 truncate">
                        <Check size={16} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{logoFileName || 'Logo Attached'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remove Logo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-sm"
                      >
                        <Upload size={14} className="text-amber-600" />
                        <span>Upload Logo / Emblem</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        PNG, JPG, or PDF proof
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Quick Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Institution / Team Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pondicherry University"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sports Secretary"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Target Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Quantity & Tier Price Calculation */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    3. Quantity & Tier Pricing
                  </label>
                  {discountPercent > 0 && (
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {discountPercent}% Bulk Discount Applied!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-l-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center text-base"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-9 text-center font-black text-sm bg-white border-y border-slate-200 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-r-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center text-base"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right flex-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Estimated Total
                    </div>
                    <div className="text-2xl font-black text-slate-900 leading-none">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      ₹{unitPrice} per piece {savings > 0 && `(Save ₹${savings.toLocaleString('en-IN')})`}
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-amber-200/60 text-[11px] text-amber-900 flex justify-between font-medium">
                  <span>10+ pcs: 10% OFF</span>
                  <span>20+ pcs: 15% OFF</span>
                  <span>50+ pcs: 25% OFF</span>
                </div>
              </div>

              {/* Fulfillment Option */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                  4. Fulfillment Model
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfillment('pickup')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      fulfillment === 'pickup'
                        ? 'border-amber-500 bg-amber-50/60 text-amber-950 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <MapPin size={15} className="text-amber-600" />
                      Showroom Pickup
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Free pickup at Lawspet, Pondicherry
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillment('delivery')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      fulfillment === 'delivery'
                        ? 'border-amber-500 bg-amber-50/60 text-amber-950 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Truck size={15} className="text-amber-600" />
                      Local Delivery
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Pondicherry, Cuddalore, Auroville
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 rounded-2xl font-black flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 transition-all text-sm sm:text-base hover:scale-[1.01]"
                >
                  <MessageSquare size={20} />
                  <span>Order & Request Proof on WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleDirectQuote}
                    className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText size={16} className="text-amber-400" />
                    <span>Download / Print Quote</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onAddToQuote) {
                        onAddToQuote(
                          {
                            selectedHeight,
                            quantity,
                            line1,
                            line2,
                            line3,
                            logoUrl: logoPreview || undefined,
                            logoFileName: logoFileName || undefined,
                            fulfillment,
                            eventDate,
                            customerName,
                            customerPhone,
                            organizationName,
                          },
                          unitPrice,
                          totalPrice
                        );
                        onClose();
                      }
                    }}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Check size={16} className="text-emerald-600" />
                    <span>Add to Multi-Item Quote</span>
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-slate-500 text-[11px]">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-amber-500" /> Free Design Proof
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-amber-500" /> Urgent 24h Turnaround
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-amber-500" /> Pondicherry Showroom
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
