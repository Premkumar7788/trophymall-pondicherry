'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { submitOrderInquiry } from '@/lib/supabase';
import { STORE_INFO } from '@/data/catalog';

export default function InstitutionalTenderForm() {
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Annual Sports Day Medals & Cups');
  const [estQty, setEstQty] = useState('50 - 100 pcs');
  const [eventDate, setEventDate] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitOrderInquiry({
        customerName: contactName,
        customerPhone: phone,
        customerEmail: email,
        organizationName: orgName,
        quantity: parseInt(estQty) || 50,
        engravingLine1: `${category} (Est Qty: ${estQty})`,
        engravingLine2: requirements,
        eventDate: eventDate || undefined,
        fulfillmentType: 'pickup',
      });
    } catch (err) {
      console.warn('Inquiry submission notice:', err);
    }

    setSubmitted(true);
    setIsSubmitting(false);

    // Also offer direct WhatsApp routing
    const text =
      `*TROPHY MALL PONDICHERRY - BULK INSTITUTIONAL INQUIRY*%0A%0A` +
      `🏫 *Institution:* ${orgName}%0A` +
      `👤 *Contact:* ${contactName} (${phone})%0A` +
      `✉️ *Email:* ${email || 'N/A'}%0A` +
      `🏆 *Category:* ${category}%0A` +
      `🔢 *Est. Quantity:* ${estQty}%0A` +
      `📅 *Target Event Date:* ${eventDate || 'Upcoming'}%0A` +
      (requirements ? `📝 *Requirements:* ${requirements}%0A` : '') +
      `%0A👉 *Please prepare and send our official tender / bulk quotation with GST.*`;

    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <section className="py-16 bg-white border-t border-slate-200" id="institutional-tender">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center mb-8">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Colleges • Schools • Sports Leagues • Corporates
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-3">
              Request an Institutional Tender Estimate
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Preparing for an Annual Sports Day, University Tournament, or Corporate Award Night? Get formal GST estimates, bulk price slabs, and sample showroom inspection.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Inquiry Successfully Logged!
              </h3>
              <p className="text-xs text-emerald-200">
                Our Lawspet showroom manager will review your specs and dispatch a customized tender quote and WhatsApp proof.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Institution / School / Club Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., SMVEC / Pondicherry University / City School"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Contact Person Name & Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Physical Director / Principal / Convener"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Mobile / WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Official Email (For GST Quote PDF)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., sports@institution.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Award Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="Annual Sports Day Medals & Cups">Sports Day Medals & Cups</option>
                    <option value="Cricket / Football Tournament Trophies">Cricket / Football League Trophies</option>
                    <option value="Corporate & Acrylic Plaques">Corporate / Academic Plaques</option>
                    <option value="Chief Guest Mementos & Crests">Chief Guest Mementos</option>
                    <option value="Mega Rolling Championship Cups">Mega Rolling Championship Cups</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Estimated Quantity
                  </label>
                  <select
                    value={estQty}
                    onChange={(e) => setEstQty(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="10 - 25 pcs">10 – 25 pcs</option>
                    <option value="25 - 50 pcs">25 – 50 pcs</option>
                    <option value="50 - 100 pcs">50 – 100 pcs</option>
                    <option value="100 - 250 pcs">100 – 250 pcs</option>
                    <option value="250+ pcs">250+ pcs (Mega Bulk)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Target Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Specific Requirements or Budget Target
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Need 150 gold medals with custom school ribbon + 15 runner/winner trophies. Budget ~₹25,000."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/25 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  <span>Submit & Route to WhatsApp Manager</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-400" /> Free Sample Showroom Inspection
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-amber-400" /> 1-Hour Estimate Turnaround
                </span>
              </div>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
