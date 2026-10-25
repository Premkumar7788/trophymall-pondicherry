'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Clock, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  MessageSquare,
  Check
} from 'lucide-react';
import { Product } from '@/types';
import { STORE_INFO } from '@/data/catalog';

interface ProductCardProps {
  product: Product;
  onCustomize: (product: Product) => void;
}

export default function ProductCard({ product, onCustomize }: ProductCardProps) {
  const discountPercent = Math.round(
    ((product.mrp - product.basePrice) / product.mrp) * 100
  );

  const maxBulkDiscount = product.bulkPricing && product.bulkPricing.length > 0
    ? Math.max(...product.bulkPricing.map((b) => b.discountPercent))
    : 15;

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = 
      `*TROPHY MALL PONDICHERRY - INQUIRY*%0A%0A` +
      `🏆 *Item:* ${product.name}%0A` +
      `💰 *Price:* ₹${product.basePrice} (MRP ₹${product.mrp})%0A` +
      `📏 *Size:* ${product.heightInches}%0A` +
      `🛠️ *Material:* ${product.material}%0A%0A` +
      `Hi, please confirm availability for showroom pickup in Pondicherry and share design proof options.`;
    
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div 
      onClick={() => onCustomize(product)}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:border-amber-400 relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-gradient-to-tr from-slate-100 to-amber-50/40 overflow-hidden flex items-center justify-center p-4">
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.isBestseller && (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
              <Flame size={12} className="fill-slate-950" /> Bestseller
            </span>
          )}
          {product.isExpress24h && (
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              <Clock size={11} /> 24h Express Engraving
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="bg-slate-900/80 backdrop-blur-md text-slate-200 font-semibold text-[10px] px-2.5 py-1 rounded-lg border border-slate-700/60">
            {product.material}
          </span>
        </div>

        {/* Product Image */}
        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover rounded-xl"
          />
        </div>

        {/* Height Pill at Bottom of Image */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">
            Height: {product.heightInches}
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          {/* Price & Discount */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">
                ₹{product.basePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            </div>

            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {discountPercent}% OFF
            </span>
          </div>

          {/* Bulk Tier Notification */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50/70 px-2.5 py-1 rounded-lg border border-amber-200/60">
            <Sparkles size={12} className="text-amber-600 shrink-0" />
            <span>Save up to {maxBulkDiscount}% on School/Club Bulk</span>
          </div>

          {/* Free Engraving Label */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Check size={12} className="text-emerald-600 font-bold" /> Free Custom Engraving
            </span>
            <span className="text-[10px] text-slate-400">Pondicherry Pickup</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            <button
              onClick={() => onCustomize(product)}
              className="col-span-4 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 group-hover:bg-amber-500 group-hover:text-slate-950"
            >
              <span>Customize & Order</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={handleQuickWhatsApp}
              className="col-span-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center transition-colors border border-emerald-200"
              title="Quick WhatsApp Inquiry"
            >
              <MessageSquare size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
