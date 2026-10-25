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
import { recordCustomerInquiry } from '@/lib/catalogStore';
import BrandLogo from './BrandLogo';

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

  const handleWhatsAppInquiry = () => {
    setIsSubmitting(true);

    const inquiryPayload = {
      customerName: customerName || 'Store Visitor',
      customerPhone: customerPhone || 'Via WhatsApp Chat',
      organizationName: organizationName || undefined,
      productId: product.id,
      quantity,
      engravingLine1: line1 || product.name,
      engravingLine2: line2 || undefined,
      eventDate: eventDate || undefined,
      fulfillmentType: fulfillment,
    };

    // Save to local & Supabase in background
    submitOrderInquiry(inquiryPayload).catch(console.warn);
    recordCustomerInquiry({
      customerName: inquiryPayload.customerName,
      customerPhone: inquiryPayload.customerPhone,
      organizationName: inquiryPayload.organizationName,
      productName: product.name,
      quantity,
      engravingLine1: line1,
      engravingLine2: line2,
      fulfillmentType: fulfillment,
      eventDate,
    }).catch(console.warn);

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
    
    // Direct trigger to avoid popup blocker on mobile
    const win = window.open(url, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = url;
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header with Aligned Brand Logo */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-200/80 bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span className="text-zinc-300">|</span>
            <span className="text-xs font-semibold text-zinc-600">Custom Engraving Configurator</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            
            {/* Left Column: Product Visuals & Live Plaque Simulator */}
            <div className="lg:col-span-5 space-y-4">
              {/* Product Picture */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 flex items-center justify-center p-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 350px"
                  className="object-contain p-2"
                />
                <div className="absolute top-2.5 left-2.5 bg-zinc-900/90 text-zinc-200 text-[10px] font-semibold px-2 py-0.5 rounded-md z-10">
                  {selectedHeight}
                </div>
              </div>

              {/* LIVE BRUSHED BRASS PLAQUE SIMULATOR - Minimalist & Crisp */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-600" />
                    Laser Engraved Plaque Preview
                  </span>
                  <span className="text-[10px] text-zinc-600 font-medium bg-zinc-100 px-2 py-0.5 rounded">
                    Included Free
                  </span>
                </div>

                <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border border-amber-300/80 rounded-xl p-4 text-zinc-950 relative overflow-hidden flex flex-col items-center justify-center min-h-[130px] text-center shadow-xs">
                  {/* Plaque Corner Screws */}
                  <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full border border-amber-400 bg-amber-200" />
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full border border-amber-400 bg-amber-200" />
                  <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full border border-amber-400 bg-amber-200" />
                  <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full border border-amber-400 bg-amber-200" />

                  {/* Logo on Plaque */}
                  {logoPreview ? (
                    <div className="mb-1.5 max-h-9 max-w-[70px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="max-h-9 max-w-[70px] object-contain filter grayscale contrast-200"
                      />
                    </div>
                  ) : (
                    <div className="text-[8px] font-semibold tracking-wider text-amber-900/60 uppercase mb-1">
                      {organizationName || 'Trophy Mall Pondicherry'}
                    </div>
                  )}

                  {/* Text Line 1 */}
                  <div className="text-xs font-extrabold tracking-wider uppercase text-zinc-950 max-w-full truncate px-2">
                    {line1 || 'ORGANIZATION / EVENT NAME'}
                  </div>

                  {/* Text Line 2 */}
                  <div className="text-xs font-black tracking-tight text-amber-950 max-w-full truncate px-2 mt-0.5">
                    {line2 || 'AWARD TITLE / WINNER'}
                  </div>

                  {/* Text Line 3 */}
                  <div className="text-[10px] font-semibold text-zinc-700 italic max-w-full truncate px-2 mt-0.5">
                    {line3 || 'Recipient Name / Year'}
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 text-center">
                  *Rendered in crisp black laser engraving on brushed gold metal plaque.
                </p>
              </div>

              {/* Showroom Specs */}
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200/80 text-xs space-y-1 text-zinc-600">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Material:</span>
                  <span className="font-semibold text-zinc-800">{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Showroom Stock:</span>
                  <span className="font-semibold text-emerald-700">Available at Lawspet</span>
                </div>
              </div>
            </div>

            {/* Right Column: Customization Controls */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Product Title & Base Price */}
              <div>
                <h4 className="text-lg font-extrabold text-zinc-900 leading-snug">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-zinc-900">
                    ₹{product.basePrice}
                  </span>
                  <span className="text-xs text-zinc-400 line-through">
                    MRP: ₹{product.mrp}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                    Free Laser Plate
                  </span>
                </div>
              </div>

              {/* Height Selection */}
              {product.heightOptions && product.heightOptions.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 block">
                    1. Select Height / Size
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.heightOptions.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setSelectedHeight(h)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedHeight === h
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Engraving Content */}
              <div className="space-y-2.5 bg-zinc-50/80 p-3.5 rounded-2xl border border-zinc-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    2. Personalized Engraving Text
                  </label>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    Free Included
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-medium block mb-1">
                    Line 1: Organization / Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Pondicherry Sports Meet 2026"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="w-full text-xs bg-white border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-medium block mb-1">
                    Line 2: Award Title / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Winner / Best Batsman / Star Performer"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    className="w-full text-xs bg-white border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-medium block mb-1">
                    Line 3: Recipient Name / Batch (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., SMVEC XI / March 2026"
                    value={line3}
                    onChange={(e) => setLine3(e.target.value)}
                    className="w-full text-xs bg-white border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Logo Upload */}
                <div className="pt-2 border-t border-zinc-200/70">
                  <label className="text-[10px] text-zinc-500 font-medium block mb-1">
                    School / Tournament Crest Logo (Optional)
                  </label>
                  
                  {logoPreview ? (
                    <div className="flex items-center justify-between p-2 bg-white border border-emerald-300 rounded-xl text-xs text-emerald-800">
                      <div className="flex items-center gap-1.5 truncate">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{logoFileName || 'Logo Attached'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remove Logo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
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
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-700 transition-colors shadow-xs"
                      >
                        <Upload size={13} className="text-amber-600" />
                        <span>Upload Logo</span>
                      </label>
                      <span className="text-[10px] text-zinc-400">
                        PNG, JPG for engraving preview
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Quick Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-zinc-500 font-medium block mb-1">
                    Institution / Team Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pondicherry University"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-medium block mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sports Director"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-medium block mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-medium block mb-1">
                    Target Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              {/* Quantity & Tier Price Calculation */}
              <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                    3. Quantity & Tier Pricing
                  </label>
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                      {discountPercent}% Bulk Discount Applied
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-l-lg bg-white border border-zinc-200 font-bold text-zinc-700 hover:bg-zinc-100 flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 h-8 text-center font-bold text-xs bg-white border-y border-zinc-200 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-r-lg bg-white border border-zinc-200 font-bold text-zinc-700 hover:bg-zinc-100 flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right flex-1">
                    <div className="text-[9px] uppercase font-bold text-zinc-400">
                      Estimated Total
                    </div>
                    <div className="text-xl font-extrabold text-zinc-900 leading-none">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      ₹{unitPrice}/pc {savings > 0 && `(Save ₹${savings.toLocaleString('en-IN')})`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fulfillment Option */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 block">
                  4. Fulfillment Model
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFulfillment('pickup')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                      fulfillment === 'pickup'
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <MapPin size={13} className={fulfillment === 'pickup' ? 'text-amber-400' : 'text-zinc-600'} />
                      Showroom Pickup
                    </div>
                    <span className={`text-[10px] ${fulfillment === 'pickup' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      Free at Lawspet, Pondicherry
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillment('delivery')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                      fulfillment === 'delivery'
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Truck size={13} className={fulfillment === 'delivery' ? 'text-amber-400' : 'text-zinc-600'} />
                      Local Delivery
                    </div>
                    <span className={`text-[10px] ${fulfillment === 'delivery' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      Pondicherry, Cuddalore, Auroville
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-xs uppercase tracking-wider"
                >
                  <MessageSquare size={16} />
                  <span>Order & Request Proof on WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleDirectQuote}
                    className="py-2.5 px-3 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText size={14} className="text-amber-400" />
                    <span>Printable Estimate</span>
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
                    className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Check size={14} className="text-emerald-600" />
                    <span>Add to Quote</span>
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-zinc-100 text-zinc-400 text-[10px]">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-amber-600" /> Free Design Proof
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-amber-600" /> 24h Turnaround
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-amber-600" /> Lawspet Showroom
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
