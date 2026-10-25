import React from 'react';
import { 
  Trophy, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  PhoneCall,
  GraduationCap
} from 'lucide-react';
import { STORE_INFO, INSTITUTIONS_SERVED } from '@/data/catalog';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenInstitutionalQuote: () => void;
}

export default function Hero({ onExploreCatalog, onOpenInstitutionalQuote }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 sm:pt-16 sm:pb-24">
      {/* Decorative Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Copy Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Location & Express Badge */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-slate-800/80 border border-slate-700/80 rounded-full px-4 py-1.5 shadow-inner">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <MapPin size={14} className="text-amber-400" />
                Lawspet, Pondicherry
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <Clock size={13} /> 24-Hour Urgent Turnaround Available
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Pondicherry’s Premier{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                Trophies, Awards & Medals
              </span>{' '}
              Showroom
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Step into our physical showroom on <strong className="text-white font-semibold">Airport Road, Lawspet</strong> to explore 500+ ready samples. Enjoy <span className="text-amber-300 font-medium">Free Laser Plate Engraving</span>, real-time WhatsApp design proofs, and unbeatable institutional bulk discounts.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Zero Engraving Plate Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Instant WhatsApp Mockup</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Showroom Click & Collect</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-7 py-4 rounded-2xl shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5 text-base"
              >
                <Trophy size={20} className="stroke-[2.5]" />
                <span>Explore Showroom Catalog</span>
              </button>

              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20Trophy%20Mall%20Pondicherry!%20I%20would%20like%20to%20request%20a%20custom%20trophy%20quote%20and%20design%20mockup.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-4 rounded-2xl shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5 text-base"
              >
                <MessageSquare size={20} />
                <span>WhatsApp Instant Quote</span>
              </a>

              <a
                href={STORE_INFO.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-4 rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <MapPin size={17} className="text-amber-400" />
                <span>Store Location</span>
                <ExternalLink size={13} className="text-slate-400" />
              </a>
            </div>

            {/* Local Phone Quick Dial */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <PhoneCall size={14} className="text-amber-400" />
                Call Showroom: <a href={`tel:${STORE_INFO.phone}`} className="text-white font-semibold hover:underline">{STORE_INFO.phone}</a>
              </span>
              <span>•</span>
              <span>Daily 10:00 AM – 9:00 PM</span>
            </div>
          </div>

          {/* Visual Interactive Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
              
              {/* Badge Over Card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Direct Showroom Experience</h3>
                    <p className="text-[11px] text-slate-400">Puducherry Local Store Advantage</p>
                  </div>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Ready in Showroom
                </span>
              </div>

              {/* Sample Engraving Plaque Mockup */}
              <div className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 text-slate-900 rounded-2xl p-5 shadow-lg border border-amber-300 relative overflow-hidden mb-5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-3 border-b border-amber-300/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-amber-800" />
                    <span className="text-[11px] font-extrabold tracking-widest uppercase text-amber-950">
                      LASER ENGRAVED PROOF
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-950 text-amber-200 px-2 py-0.5 rounded">
                    FREE
                  </span>
                </div>

                <div className="text-center py-2 space-y-1">
                  <div className="text-xs font-black tracking-wide text-slate-900 uppercase">
                    PONDICHERRY SPORTS LEAGUE 2026
                  </div>
                  <div className="text-base font-black text-amber-900 tracking-tight">
                    CHAMPIONS OF THE TOURNAMENT
                  </div>
                  <div className="text-xs font-bold text-slate-700 italic">
                    Awarded to: SMVEC Premier XI
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-amber-300/80 flex items-center justify-between text-[10px] text-amber-950 font-semibold">
                  <span>Showroom Laser Unit #1</span>
                  <span>Zero Plate Cost</span>
                </div>
              </div>

              {/* Store Guarantee Checklist */}
              <div className="space-y-2.5 text-xs text-slate-300 mb-5">
                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Showroom Address:</span>
                  <span className="text-white font-medium text-right text-[11px]">76, 1st Flr, Lawspet, Pondicherry</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Custom Proof Approval:</span>
                  <span className="text-emerald-400 font-semibold">Within 15 Mins on WhatsApp</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Institutional Purchase:</span>
                  <span className="text-amber-400 font-semibold">Official GST Estimates Provided</span>
                </div>
              </div>

              {/* Secondary Instant Action */}
              <button
                onClick={onOpenInstitutionalQuote}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-center gap-2 transition-colors"
              >
                <GraduationCap size={16} />
                Generate Institutional Tender Estimate (PDF / Print)
              </button>
            </div>
          </div>
        </div>

        {/* Local Institutions Trust Strip */}
        <div className="mt-16 pt-8 border-t border-slate-800/80" id="institutions">
          <div className="text-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Trusted by Premier Institutions & Tournaments in Pondicherry & Tamil Nadu
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
            {INSTITUTIONS_SERVED.map((item, index) => (
              <div 
                key={index} 
                className="px-3.5 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
