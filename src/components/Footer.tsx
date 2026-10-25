import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { STORE_INFO, CATEGORIES } from '@/data/catalog';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 no-print">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col - Using Aligned BrandLogo Component */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" theme="dark" />

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Pondicherry&apos;s leading awards showroom. Specializing in tournament trophies, school & college sports day medals, corporate laser-cut acrylic plaques, and wooden mementos with on-the-spot laser plate engraving.
            </p>

            <div className="pt-1 flex items-center gap-2.5 text-xs text-zinc-300">
              <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-[11px]">
                <ShieldCheck size={13} className="text-amber-400" />
                <span>GST Registered Invoicing</span>
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-[11px]">
                <Clock size={13} className="text-emerald-400" />
                <span>24h Express Engraving</span>
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(1).map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#${cat.slug}`}
                    className="hover:text-zinc-200 transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Physical Showroom Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Showroom
            </h4>
            <div className="space-y-1.5 text-xs leading-relaxed">
              <p className="text-zinc-300 font-medium">
                {STORE_INFO.address}
              </p>
              <p className="text-zinc-500 text-[11px]">
                {STORE_INFO.landmarks}
              </p>
              <div className="pt-1">
                <a
                  href={STORE_INFO.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-medium"
                >
                  <MapPin size={12} />
                  <span>Google Maps Directions</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-amber-400 shrink-0" />
                <a href={`tel:${STORE_INFO.phone}`} className="hover:text-white transition-colors">
                  {STORE_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare size={13} className="text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Inquiries
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-amber-400 shrink-0" />
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-white transition-colors">
                  {STORE_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1 text-zinc-500 text-[11px]">
                <Clock size={13} className="shrink-0 mt-0.5" />
                <span>Mon – Sat: 10AM – 9PM<br />Sunday: Prior Appointment</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-900 bg-black/40 py-5 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} Trophy Mall Pondicherry. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Showroom: 76, 1st Floor, Lawspet, Airport Road, Pondicherry</span>
            <span>•</span>
            <a href="/admin" className="text-zinc-600 hover:text-zinc-400 transition-colors">
              Owner Admin
            </a>
          </div>
        </div>
      </div>

      {/* Minimalist Floating WhatsApp Action */}
      <div className="fixed bottom-5 right-5 z-40">
        <a
          href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20Trophy%20Mall%20Pondicherry!%20I%20would%20like%20to%20order%20trophies.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-2.5 rounded-full shadow-lg shadow-black/30 transition-all hover:scale-105"
          aria-label="Order on WhatsApp"
        >
          <MessageSquare size={17} />
          <span className="hidden sm:inline text-xs font-semibold">
            Order on WhatsApp
          </span>
        </a>
      </div>
    </footer>
  );
}
