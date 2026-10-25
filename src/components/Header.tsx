'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  MessageSquare, 
  Clock, 
  Menu, 
  X, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { useStoreSettings } from '@/lib/storeSettings';
import BrandLogo from './BrandLogo';

interface HeaderProps {
  onOpenQuoteModal?: () => void;
  quoteCount?: number;
}

export default function Header({ onOpenQuoteModal, quoteCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const store = useStoreSettings();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 no-print transition-all">
      {/* Top Announcement Bar - Minimalist & Sleek */}
      <div className="bg-zinc-900 text-zinc-300 px-4 py-1.5 text-[11px] border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-medium text-zinc-200">Showroom:</span>
            <span className="text-zinc-300 hidden sm:inline">{store.announcementText}</span>
            <span className="text-zinc-500 hidden sm:inline">•</span>
            <span className="text-zinc-300 flex items-center gap-1">
              <Clock size={11} className="text-amber-400 inline" /> {store.hours}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href={store.mapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 font-medium text-zinc-300"
            >
              <MapPin size={11} className="text-amber-400" />
              <span>Google Maps Location</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Properly Aligned Brand Logo Lockup */}
          <Link href="/" className="group flex items-center">
            <BrandLogo size="md" />
          </Link>

          {/* Minimalist Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            <a href="#catalog" className="hover:text-zinc-950 transition-colors">Catalog</a>
            <a href="#sports" className="hover:text-zinc-950 transition-colors">Sports</a>
            <a href="#corporate" className="hover:text-zinc-950 transition-colors">Corporate</a>
            <a href="#medals" className="hover:text-zinc-950 transition-colors">Medals</a>
            <a href="#mega" className="hover:text-zinc-950 transition-colors">Big Cups</a>
            <a href="#showroom" className="hover:text-zinc-950 transition-colors flex items-center gap-1">
              <MapPin size={13} className="text-amber-600" /> Showroom
            </a>
            <a href="#institutional-tender" className="hover:text-zinc-950 transition-colors">
              Institutions
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {onOpenQuoteModal && (
              <button
                onClick={onOpenQuoteModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors border border-zinc-200/80"
                title="View Official Quotation"
              >
                <FileText size={14} className="text-zinc-600" />
                <span>Estimate</span>
                {quoteCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-white text-[10px] font-bold">
                    {quoteCount}
                  </span>
                )}
              </button>
            )}

            <a
              href={`https://wa.me/${store.whatsapp}?text=Hello%20Trophy%20Mall%20Pondicherry!%20I%20would%20like%20to%20inquire%20about%20trophies%20and%20custom%20engraving.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <MessageSquare size={14} className="text-emerald-400" />
              <span>WhatsApp Proof</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={`https://wa.me/${store.whatsapp}?text=Hello%20Trophy%20Mall%20Pondicherry!`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-800 bg-zinc-100 rounded-lg"
              aria-label="WhatsApp"
            >
              <MessageSquare size={18} />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-700 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Minimalist Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-zinc-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80 flex items-center justify-between text-xs font-medium text-zinc-800">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-amber-600" />
              <span>{store.name} • {store.hours}</span>
            </div>
            <a 
              href={store.mapsLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-900 font-bold underline"
            >
              Map
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-zinc-700">
            <a 
              href="#catalog" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-lg flex items-center justify-between"
            >
              <span>Full Catalog</span>
              <ChevronRight size={13} className="text-zinc-400" />
            </a>
            <a 
              href="#sports" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-lg flex items-center justify-between"
            >
              <span>Sports & Cricket</span>
              <ChevronRight size={13} className="text-zinc-400" />
            </a>
            <a 
              href="#corporate" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-lg flex items-center justify-between"
            >
              <span>Corporate Acrylic</span>
              <ChevronRight size={13} className="text-zinc-400" />
            </a>
            <a 
              href="#medals" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-lg flex items-center justify-between"
            >
              <span>Medals & Ribbons</span>
              <ChevronRight size={13} className="text-zinc-400" />
            </a>
            <a 
              href="#mega" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-lg flex items-center justify-between"
            >
              <span>Big Rolling Cups</span>
              <ChevronRight size={13} className="text-zinc-400" />
            </a>
            <a 
              href="#showroom" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-lg flex items-center justify-between"
            >
              <span>Showroom Map</span>
              <ChevronRight size={13} className="text-zinc-400" />
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {onOpenQuoteModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl text-xs"
              >
                <FileText size={14} /> View Instant Quote
              </button>
            )}

            <a
              href={`https://wa.me/${store.whatsapp}?text=Hello%20Trophy%20Mall%20Pondicherry!%20I%20would%20like%20to%20order%20trophies.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-xs"
            >
              <MessageSquare size={14} /> WhatsApp Inquiries
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
