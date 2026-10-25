'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Menu, 
  X, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { STORE_INFO } from '@/data/catalog';

interface HeaderProps {
  onOpenQuoteModal?: () => void;
  quoteCount?: number;
}

export default function Header({ onOpenQuoteModal, quoteCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm no-print">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-amber-400">Pondicherry Showroom:</span>
            <span className="hidden md:inline text-slate-300">Lawspet, Airport Road, Rajaji Nagar • Open Mon–Sat 10AM–9PM</span>
            <span className="md:hidden text-slate-300 truncate">Lawspet, Pondicherry • Open Today</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-300">
            <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
              <Clock size={12} /> 24h Express Engraving
            </span>
            <span className="text-slate-600">|</span>
            <a 
              href={STORE_INFO.mapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
            >
              <MapPin size={12} className="text-amber-400" />
              <span className="underline underline-offset-2">Google Maps</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Trophy size={26} className="text-slate-950 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                  TROPHY MALL
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-amber-600 -mt-1 flex items-center gap-1">
                <MapPin size={10} className="text-amber-600 inline" /> Puducherry, India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#catalog" className="hover:text-amber-600 transition-colors">Catalog</a>
            <a href="#sports" className="hover:text-amber-600 transition-colors">Sports</a>
            <a href="#corporate" className="hover:text-amber-600 transition-colors">Corporate & Acrylic</a>
            <a href="#medals" className="hover:text-amber-600 transition-colors">Medals</a>
            <a href="#mega" className="hover:text-amber-600 transition-colors">Mega Cups</a>
            <a href="#showroom" className="hover:text-amber-600 transition-colors flex items-center gap-1 text-slate-900">
              <MapPin size={14} className="text-amber-500" /> Showroom
            </a>
            <a href="#institutions" className="hover:text-amber-600 transition-colors text-slate-600">
              Colleges & Schools
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {onOpenQuoteModal && (
              <button
                onClick={onOpenQuoteModal}
                className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
                title="View Institutional Quotation"
              >
                <FileText size={15} className="text-amber-600" />
                <span>Estimate Quote</span>
                {quoteCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-[11px] font-black">
                    {quoteCount}
                  </span>
                )}
              </button>
            )}

            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20Trophy%20Mall%20Pondicherry!%20I%20would%20like%20to%20inquire%20about%20trophies%20and%20custom%20engraving.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <MessageSquare size={16} />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20Trophy%20Mall%20Pondicherry!`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-600 bg-emerald-50 rounded-lg"
              aria-label="WhatsApp"
            >
              <MessageSquare size={20} />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs font-semibold text-amber-900">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-amber-600" />
              <span>Lawspet Showroom • Open 10 AM - 9 PM</span>
            </div>
            <a 
              href={STORE_INFO.mapsLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-amber-700 font-bold underline"
            >
              Directions
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-slate-700">
            <a 
              href="#catalog" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-slate-50 hover:bg-amber-50 rounded-lg flex items-center justify-between"
            >
              <span>Full Catalog</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
            <a 
              href="#sports" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-slate-50 hover:bg-amber-50 rounded-lg flex items-center justify-between"
            >
              <span>Cricket & Sports</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
            <a 
              href="#corporate" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-slate-50 hover:bg-amber-50 rounded-lg flex items-center justify-between"
            >
              <span>Corporate Acrylic</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
            <a 
              href="#medals" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-slate-50 hover:bg-amber-50 rounded-lg flex items-center justify-between"
            >
              <span>Medals & Ribbons</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
            <a 
              href="#mega" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-slate-50 hover:bg-amber-50 rounded-lg flex items-center justify-between"
            >
              <span>Championship Cups</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
            <a 
              href="#showroom" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2.5 bg-slate-50 hover:bg-amber-50 rounded-lg flex items-center justify-between"
            >
              <span>Showroom Map</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {onOpenQuoteModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm"
              >
                <FileText size={16} /> Instant Institutional Quote
              </button>
            )}

            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20Trophy%20Mall%20Pondicherry!%20I%20would%20like%20to%20order%20trophies.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md"
            >
              <MessageSquare size={16} /> Order / Request Proof on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
