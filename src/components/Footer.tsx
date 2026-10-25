import React from 'react';
import { 
  Trophy, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { STORE_INFO, CATEGORIES } from '@/data/catalog';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 no-print">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                <Trophy size={22} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">
                  TROPHY MALL
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
                  Puducherry, India
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Pondicherry&apos;s leading awards showroom. Specializing in tournament trophies, school & college sports day medals, corporate laser-cut acrylic plaques, and wooden mementos with on-the-spot laser plate engraving.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <ShieldCheck size={14} className="text-amber-400" />
                <span>GST Registered Invoicing</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <Clock size={14} className="text-emerald-400" />
                <span>24h Express Turnaround</span>
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Award Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(1).map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#${cat.slug}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Physical Showroom Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Pondicherry Showroom
            </h4>
            <div className="space-y-2 text-xs leading-relaxed">
              <p className="text-slate-300 font-medium">
                {STORE_INFO.address}
              </p>
              <p className="text-slate-500">
                Landmarks: {STORE_INFO.landmarks}
              </p>
              <div className="pt-1">
                <a
                  href={STORE_INFO.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <MapPin size={13} />
                  <span>Google Maps Directions</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400 shrink-0" />
                <a href={`tel:${STORE_INFO.phone}`} className="hover:text-white transition-colors">
                  {STORE_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare size={14} className="text-emerald-400 shrink-0" />
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
                <Mail size={14} className="text-amber-400 shrink-0" />
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-white transition-colors">
                  {STORE_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1 text-slate-500">
                <Clock size={14} className="shrink-0 mt-0.5" />
                <span>Mon – Sat: 10AM – 9PM<br />Sunday: Prior Appointment</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Trophy Mall Pondicherry. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with 100% Free & Open-Source Stack (Next.js, Tailwind CSS, Supabase & Vercel)
          </p>
        </div>
      </div>

      {/* Persistent Floating WhatsApp Button on Mobile & Desktop */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20Trophy%20Mall%20Pondicherry!%20I%20would%20like%20to%20order%20trophies.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-full shadow-2xl shadow-emerald-950 transition-all hover:scale-105 group border-2 border-white/20"
          aria-label="Order on WhatsApp"
        >
          <div className="relative">
            <MessageSquare size={22} />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
            </span>
          </div>
          <span className="hidden sm:inline text-xs font-black tracking-wide">
            Order on WhatsApp
          </span>
        </a>
      </div>
    </footer>
  );
}
