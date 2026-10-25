'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Trophy, 
  MapPin, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { INSTITUTIONS_SERVED, SHOWROOM_GALLERY_IMAGES } from '@/data/catalog';
import { useStoreSettings } from '@/lib/storeSettings';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenInstitutionalQuote: () => void;
}

export default function Hero({ onExploreCatalog, onOpenInstitutionalQuote }: HeroProps) {
  const store = useStoreSettings();
  return (
    <section className="relative bg-zinc-950 text-white pt-10 pb-16 sm:pt-14 sm:pb-20 overflow-hidden border-b border-zinc-800/80">
      {/* Subtle Minimalist Ambient Background Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-amber-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Physical Showroom in Lawspet</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-amber-400">
            <Clock size={12} />
            <span>24h Express Laser Engraving</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Main Hero Copy Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Minimalist Crisp Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
              Trophies, Awards & Medals{' '}
              <span className="text-amber-400 font-extrabold">Showroom</span>{' '}
              in Pondicherry
            </h1>

            {/* Clean Subtitle */}
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore 500+ display samples at our physical showroom on <strong className="text-zinc-200 font-semibold">Airport Road, Lawspet</strong>. Free laser-engraved metal plates, WhatsApp design proof approval, and bulk institutional pricing.
            </p>

            {/* Subtle Feature List */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-400" /> Free Custom Plate Engraving
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-400" /> WhatsApp Proof Before Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-400" /> Showroom Click & Collect
              </span>
            </div>

            {/* Minimalist Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-sm"
              >
                <Trophy size={16} />
                <span>Explore Catalog</span>
              </button>

              <a
                href={`https://wa.me/${store.whatsapp}?text=Hello%20Trophy%20Mall%20Pondicherry!%20I%20would%20like%20to%20request%20a%20custom%20trophy%20quote.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/80 font-medium px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <MessageSquare size={16} className="text-emerald-400" />
                <span>WhatsApp Quote</span>
              </a>

              <a
                href={store.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-zinc-400 hover:text-white px-4 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
              >
                <MapPin size={14} className="text-amber-400" />
                <span>Directions</span>
                <ExternalLink size={11} className="text-zinc-500" />
              </a>
            </div>

            {/* Direct Phone Dial */}
            <div className="pt-1 flex items-center justify-center lg:justify-start gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <PhoneCall size={13} className="text-amber-400" />
                Showroom: <a href={`tel:${store.phone}`} className="text-zinc-300 font-medium hover:underline">{store.phone}</a>
              </span>
              <span>•</span>
              <span>{store.hours}</span>
            </div>

          </div>

          {/* Right Column: Real Showroom Photos Showcase */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Showroom Gallery
                    </h3>
                    <p className="text-[10px] text-zinc-400">
                      Actual Showroom & Award Collections
                    </p>
                  </div>
                </div>

                <a
                  href={store.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Google Maps Photos</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              {/* 4-Photo Minimalist Grid from Google Maps & Showroom */}
              <div className="grid grid-cols-2 gap-2.5">
                {SHOWROOM_GALLERY_IMAGES.map((item, idx) => (
                  <div 
                    key={idx}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/60"
                  >
                    <Image
                      src={item.url}
                      alt={item.caption}
                      fill
                      sizes="(max-width: 768px) 50vw, 200px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-medium text-zinc-200 truncate">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Plaque Proof Preview Pill */}
              <div className="mt-3 p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-300 text-[11px]">
                  <Trophy size={14} className="text-amber-400 shrink-0" />
                  <span>Free Laser Engraved Proof with every award</span>
                </div>
                <button
                  onClick={onOpenInstitutionalQuote}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider underline underline-offset-2"
                >
                  Get Estimate
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Minimalist Local Institutions Strip */}
        <div className="mt-12 pt-6 border-t border-zinc-800/60" id="institutions">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Trusted in Pondicherry:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
              {INSTITUTIONS_SERVED.slice(0, 5).map((inst, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300"
                >
                  {inst.name}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
