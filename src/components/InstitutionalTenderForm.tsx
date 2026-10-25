'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { submitOrderInquiry } from '@/lib/supabase';
import { recordCustomerInquiry } from '@/lib/catalogStore';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      customerName: contactName,
      customerPhone: phone,
      customerEmail: email,
      organizationName: orgName,
      quantity: parseInt(estQty) || 50,
      engravingLine1: `${category} (Est Qty: ${estQty})`,
      engravingLine2: requirements,
      eventDate: eventDate || undefined,
      fulfillmentType: 'pickup' as const,
    };

    submitOrderInquiry(payload).catch(console.warn);
    recordCustomerInquiry({
      customerName: contactName,
      customerPhone: phone,
      customerEmail: email,
      organizationName: orgName,
      productName: category,
      quantity: payload.quantity,
      engravingLine1: payload.engravingLine1,
      engravingLine2: requirements,
      fulfillmentType: 'pickup',
      eventDate,
    }).catch(console.warn);

    setSubmitted(true);
    setIsSubmitting(false);

    // Direct WhatsApp routing without being blocked by popup blocker
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

    const url = `https://wa.me/${STORE_INFO.whatsapp}?text=${text}`;
    const win = window.open(url, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = url;
    }
  };

  return (
    <section className="py-14 bg-zinc-50/60 border-t border-zinc-200/80" id="institutional-tender">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-zinc-800">
          
          <div className="max-w-xl mx-auto text-center mb-7">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
              Institutional Estimates
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2.5">
              Request a Bulk Tender Quote
            </h2>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Official GST quotes, bulk discount tiers, and physical sample showroom inspection for Pondicherry schools, colleges, and sports bodies.
            </p>
          </div>

          {submitted ? (
            <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-6 text-center space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 bg-emerald-500 text-zinc-950 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={26} />
              </div>
              <h3 className="text-base font-bold text-white">
                Inquiry Successfully Logged!
              </h3>
              <p className="text-xs text-zinc-400">
                Our Lawspet showroom manager will review your specs and dispatch a customized tender quote and WhatsApp proof.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Institution / School / Club Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., SMVEC / Pondicherry University"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Contact Person Name & Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Physical Director / Principal"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Mobile / WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Official Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., sports@institution.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Award Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2 text-white outline-none focus:border-zinc-500"
                  >
                    <option value="Annual Sports Day Medals & Cups">Sports Day Medals & Cups</option>
                    <option value="Cricket / Football Tournament Trophies">Cricket / Football Trophies</option>
                    <option value="Corporate & Acrylic Plaques">Corporate & Academic Plaques</option>
                    <option value="Chief Guest Mementos & Crests">Chief Guest Mementos</option>
                    <option value="Mega Rolling Championship Cups">Big Rolling Cups</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Estimated Quantity
                  </label>
                  <select
                    value={estQty}
                    onChange={(e) => setEstQty(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2 text-white outline-none focus:border-zinc-500"
                  >
                    <option value="10 - 25 pcs">10 – 25 pcs</option>
                    <option value="25 - 50 pcs">25 – 50 pcs</option>
                    <option value="50 - 100 pcs">50 – 100 pcs</option>
                    <option value="100 - 250 pcs">100 – 250 pcs</option>
                    <option value="250+ pcs">250+ pcs (Mega Bulk)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Target Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2 text-white outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Specific Requirements or Budget Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Need 150 gold medals with custom school ribbon + 15 runner/winner trophies."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                />
              </div>

              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-3 px-5 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <MessageSquare size={15} />
                  <span>Submit & Route to WhatsApp Manager</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 pt-1 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-400" /> Free Sample Inspection
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-amber-400" /> 1-Hour Estimate Turnaround
                </span>
              </div>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
