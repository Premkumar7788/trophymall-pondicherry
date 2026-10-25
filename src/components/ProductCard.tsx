'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Clock, 
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
      className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-400/90 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer relative hover:shadow-md"
    >
      {/* Top Image Container with generous padding & clean background */}
      <div className="relative aspect-square bg-zinc-50 overflow-hidden flex items-center justify-center p-4 border-b border-zinc-100">
        
        {/* Subtle Minimalist Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {product.isBestseller && (
            <span className="bg-zinc-900 text-white font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
              Bestseller
            </span>
          )}
          {product.isExpress24h && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock size={10} /> 24h Express
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="bg-white/90 backdrop-blur-xs text-zinc-600 font-medium text-[10px] px-2 py-0.5 rounded-md border border-zinc-200/80 shadow-xs">
            {product.material}
          </span>
        </div>

        {/* Product Image */}
        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-2"
          />
        </div>

        {/* Height tag */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="bg-white/95 text-zinc-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-zinc-200 shadow-xs">
            {product.heightInches}
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-zinc-900 text-sm group-hover:text-amber-700 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-zinc-100 space-y-2.5">
          {/* Price & Discount */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-zinc-900">
                ₹{product.basePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-zinc-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            </div>

            <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          </div>

          {/* Bulk Tier Notification */}
          <div className="text-[10px] text-amber-800 bg-amber-50/60 px-2 py-1 rounded-md border border-amber-200/50 flex items-center justify-between font-medium">
            <span>Bulk Savings:</span>
            <span className="font-bold">Up to {maxBulkDiscount}% off</span>
          </div>

          {/* Free Engraving Label */}
          <div className="flex items-center justify-between text-[10px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Check size={11} className="text-emerald-600 font-bold" /> Free Laser Engraving
            </span>
            <span>Lawspet Store</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-1.5 pt-0.5">
            <button
              onClick={() => onCustomize(product)}
              className="col-span-4 bg-zinc-900 hover:bg-black text-white font-medium py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Customize</span>
              <ArrowRight size={13} />
            </button>

            <button
              onClick={handleQuickWhatsApp}
              className="col-span-1 bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-700 text-zinc-700 rounded-xl flex items-center justify-center transition-colors border border-zinc-200/80"
              title="Quick WhatsApp Inquiry"
            >
              <MessageSquare size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
