import React from 'react';
import { Eye, ShieldCheck, Zap, Receipt, Check } from 'lucide-react';

export default function ShowroomHighlights() {
  const features = [
    {
      icon: Eye,
      title: '500+ Live Showroom Samples',
      description:
        'Touch, feel, and inspect trophy weights, crystal clarity, and wooden finishes at our Lawspet showroom before confirming your order.',
      highlight: 'Lawspet Airport Road',
    },
    {
      icon: Zap,
      title: 'Free On-The-Spot Laser Engraving',
      description:
        'Every trophy and medal includes complimentary precision laser engraving on brushed brass or acrylic plaques. Zero setup or hidden plate fees.',
      highlight: 'Zero Plate Fees',
    },
    {
      icon: ShieldCheck,
      title: 'WhatsApp Instant Design Proofs',
      description:
        'Share your school/tournament logo and event text on WhatsApp. Receive an exact digital artwork preview for committee sign-off before cutting.',
      highlight: '15-Minute Response',
    },
    {
      icon: Receipt,
      title: 'College & School GST Quotes',
      description:
        'Instant printable estimates and formal GST invoices for school principals, college sports directors, and corporate purchase departments.',
      highlight: 'Official Paperwork',
    },
  ];

  return (
    <section className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Why Choose Trophy Mall Pondicherry
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            The Local Showroom Advantage
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Avoid online order disappointments. Partner with Pondicherry&apos;s dedicated physical awards showroom for flawless event execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-50 hover:bg-amber-50/40 p-6 rounded-2xl border border-slate-200/80 transition-all hover:border-amber-300 hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-amber-700">
                  <Check size={14} className="text-emerald-600" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
