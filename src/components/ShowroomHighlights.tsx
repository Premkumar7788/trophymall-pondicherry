import React from 'react';
import { Eye, ShieldCheck, Zap, Receipt } from 'lucide-react';

export default function ShowroomHighlights() {
  const features = [
    {
      icon: Eye,
      title: '500+ Showroom Samples',
      description:
        'Inspect trophy weights, wooden finishes, and crystal clarity in person at our Lawspet showroom before confirming.',
      tag: 'In-Store Display',
    },
    {
      icon: Zap,
      title: 'Free On-The-Spot Laser Engraving',
      description:
        'Complimentary high-contrast laser plate engraving on brushed brass or acrylic. Zero plate charges or hidden fees.',
      tag: 'Zero Plate Cost',
    },
    {
      icon: ShieldCheck,
      title: 'WhatsApp Design Proofs',
      description:
        'Share your logo and text on WhatsApp. Receive exact digital artwork proof for committee approval within 15 minutes.',
      tag: 'Fast Digital Proof',
    },
    {
      icon: Receipt,
      title: 'GST Quotations & Invoicing',
      description:
        'Official estimates and formal GST invoices for Pondicherry schools, colleges, institutions, and corporate committees.',
      tag: 'Institutional Ready',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 mb-3 shadow-xs">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold text-zinc-900 text-sm mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200/60">
                  <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
