'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  MessageSquare, 
  Trash2
} from 'lucide-react';
import { QuoteItem } from '@/types';
import { STORE_INFO } from '@/data/catalog';
import BrandLogo from './BrandLogo';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  onRemoveItem?: (index: number) => void;
  onClearAll?: () => void;
}

export default function QuoteModal({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearAll,
}: QuoteModalProps) {
  const [customerOrg, setCustomerOrg] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [quoteRef, setQuoteRef] = useState('TMP-849201');

  React.useEffect(() => {
    if (isOpen) {
      setQuoteRef(`TMP-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const grandTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.customization.quantity, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppQuote = () => {
    let itemsText = '';
    items.forEach((item, idx) => {
      itemsText += 
        `%0A${idx + 1}. *${item.product.name}* (${item.customization.selectedHeight})%0A` +
        `   - Qty: ${item.customization.quantity} pcs @ ₹${item.unitPrice} = ₹${item.totalPrice}%0A` +
        `   - Line 1: ${item.customization.line1 || 'N/A'}%0A` +
        `   - Line 2: ${item.customization.line2 || 'N/A'}%0A`;
    });

    const message =
      `*TROPHY MALL PONDICHERRY - OFFICIAL QUOTATION REQUEST*%0A` +
      `*Quote Ref:* ${quoteRef}%0A` +
      `*Date:* ${currentDate}%0A%0A` +
      (customerOrg ? `*Institution / Organization:* ${customerOrg}%0A` : '') +
      (contactPerson ? `*Contact Person:* ${contactPerson}%0A` : '') +
      (contactPhone ? `*Phone:* ${contactPhone}%0A` : '') +
      (eventDate ? `*Event Date:* ${eventDate}%0A` : '') +
      `%0A*Items List:*${itemsText}%0A` +
      `*Total Quantity:* ${totalQuantity} pcs%0A` +
      `*Grand Total Estimate:* ₹${grandTotal.toLocaleString('en-IN')}%0A%0A` +
      `📍 *Showroom:* 76, 1st Floor, Lawspet, Pondicherry%0A` +
      `👉 Please review and send official GST proforma invoice / design proofs.`;

    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden my-auto max-h-[95vh] flex flex-col border border-zinc-200">
        
        {/* Top Control Bar (Hidden when printed) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-zinc-900 text-white border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" theme="dark" showSubtitle={false} />
            <span className="text-zinc-500">|</span>
            <span className="text-xs font-semibold text-zinc-300">Official Institutional Estimate</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-semibold shadow-xs transition-colors hover:bg-zinc-100"
            >
              <Printer size={13} />
              <span>Print PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Quotation Content */}
        <div className="overflow-y-auto p-6 sm:p-10 printable-quote text-zinc-900 bg-white">
          
          {/* Letterhead Header with Aligned Brand Logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-zinc-900 gap-4">
            <div className="space-y-1">
              <BrandLogo size="lg" />
              <p className="text-[11px] text-zinc-500 mt-2">
                Physical Awards Showroom & Precision Laser Engraving<br />
                76, 1st Floor, Lawspet, Airport Road, Rajaji Nagar, Puducherry - 605008
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs">
              <div className="font-mono font-bold text-zinc-800">
                ESTIMATE REF: <span className="text-amber-700">{quoteRef}</span>
              </div>
              <div className="text-zinc-500">
                Date: <strong className="text-zinc-800">{currentDate}</strong>
              </div>
              <div className="text-zinc-500">
                Validity: <strong>15 Days</strong>
              </div>
              <div className="text-zinc-500">
                Ph: <strong>{STORE_INFO.phone}</strong>
              </div>
            </div>
          </div>

          {/* Customer / Institution Details Form (Interactive inputs in screen view) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                Quotation Issued To:
              </span>
              <input
                type="text"
                placeholder="College / School / Organization Name"
                value={customerOrg}
                onChange={(e) => setCustomerOrg(e.target.value)}
                className="w-full text-xs sm:text-sm font-bold bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-zinc-400"
              />
              <input
                type="text"
                placeholder="Attn: Principal / Sports Director / Convener"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-zinc-400 mt-2"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                Event & Contact Info:
              </span>
              <input
                type="text"
                placeholder="Contact Phone Number"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-zinc-400"
              />
              <input
                type="text"
                placeholder="Event / Tournament Date (e.g. 15 March 2026)"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 bg-zinc-100 text-zinc-800 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Height / Specs</th>
                  <th className="py-2.5 px-3">Custom Plate Engraving</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                  {onRemoveItem && <th className="py-2.5 px-2 no-print text-center"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-zinc-400 italic">
                      No items currently added. Customize any trophy from the catalog to add to this quotation.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={index} className="hover:bg-zinc-50">
                      <td className="py-3 px-3 font-semibold text-zinc-500">{index + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-zinc-900">{item.product.name}</div>
                        <div className="text-[10px] text-zinc-500">Material: {item.product.material}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-zinc-700">
                        {item.customization.selectedHeight}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-[11px] font-semibold text-zinc-800">
                          {item.customization.line1 || 'Standard Event Plate'}
                        </div>
                        {item.customization.line2 && (
                          <div className="text-[10px] text-amber-800">
                            {item.customization.line2}
                          </div>
                        )}
                        <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                          Free Laser Engraving
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium">
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        {item.customization.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-zinc-900">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </td>
                      {onRemoveItem && (
                        <td className="py-3 px-2 text-center no-print">
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
              {items.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-zinc-900 font-bold text-zinc-900 bg-zinc-50">
                    <td colSpan={5} className="py-3 px-3 text-right text-xs uppercase font-black">
                      Total ({totalQuantity} Units):
                    </td>
                    <td className="py-3 px-3 text-center font-black">
                      {totalQuantity}
                    </td>
                    <td className="py-3 px-3 text-right text-base font-black text-zinc-950">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </td>
                    {onRemoveItem && <td className="no-print"></td>}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Terms & Showroom Guarantee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 pt-4 border-t border-zinc-200 text-[11px] text-zinc-600">
            <div>
              <h4 className="font-bold text-zinc-900 uppercase tracking-wider mb-1.5">
                Terms & Conditions:
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Complimentary laser-engraved metal plaque included for every award.</li>
                <li>Digital artwork proof shared on WhatsApp for authorization prior to engraving.</li>
                <li>Free Showroom Pickup available at Trophy Mall, Lawspet, Pondicherry.</li>
                <li>Prices are inclusive of customization. Official GST proforma invoice provided.</li>
              </ul>
            </div>

            <div className="flex flex-col justify-end items-start sm:items-end text-left sm:text-right pt-6 sm:pt-0">
              <div className="border-b border-zinc-400 w-48 pb-1 text-center font-serif text-zinc-500 italic">
                Authorized Signature
              </div>
              <span className="font-bold text-zinc-900 text-xs mt-1">
                For Trophy Mall Pondicherry
              </span>
              <span className="text-[10px] text-zinc-400">
                Puducherry - 605008
              </span>
            </div>
          </div>

          {/* Bottom Action Bar (Screen Only) */}
          <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-zinc-200">
            {onClearAll && items.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 size={13} /> Clear Quote List
              </button>
            )}

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                <Printer size={14} />
                <span>Print Official PDF</span>
              </button>

              <button
                onClick={handleWhatsAppQuote}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <MessageSquare size={14} />
                <span>Submit to WhatsApp</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
