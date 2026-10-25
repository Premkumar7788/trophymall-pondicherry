import React from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink, 
  Truck, 
  Navigation,
  PhoneCall
} from 'lucide-react';
import { STORE_INFO } from '@/data/catalog';

export default function ShowroomSection() {
  const directMapsLink = STORE_INFO.mapsLink;
  const shareMapsLink = STORE_INFO.mapsShareLink;

  const deliveryAreas = [
    'Lawspet',
    'Rajaji Nagar',
    'Airport Road',
    'Muthialpet',
    'White Town',
    'Reddiarpalayam',
    'Villianur',
    'Gorimedu',
    'Kalapet (PU Campus)',
    'Auroville',
    'Cuddalore',
    'Villupuram',
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200" id="showroom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-amber-700 text-xs font-black uppercase tracking-widest bg-amber-100/70 px-3.5 py-1.5 rounded-full border border-amber-300/60">
            Physical Store & Showroom
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
            Visit Trophy Mall in Pondicherry
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2.5">
            Examine trophy finishes, explore 500+ physical display samples, and review laser-engraved proof plaques in person before event day.
          </p>
        </div>

        {/* Main Showroom Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200/90">
          
          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200/60 shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Showroom Address</h4>
                <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug">
                  {STORE_INFO.address}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Landmark: {STORE_INFO.landmarks}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <a
                    href={directMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink size={12} />
                  </a>

                  <a
                    href={shareMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    <span>Short Link</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200/60 shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Business Hours</h4>
                <p className="text-sm text-slate-700 mt-1">
                  <strong>Monday – Saturday:</strong> 10:00 AM – 9:00 PM<br />
                  <strong>Sunday:</strong> Prior Appointment / Urgent Tournament Emergency Pickups
                </p>
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Showroom Open for In-Store Walk-ins
                </span>
              </div>
            </div>

            {/* Direct Inquiries & Phone */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200/60 shrink-0">
                <PhoneCall size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Direct Showroom Hotline</h4>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  <a href={`tel:${STORE_INFO.phone}`} className="hover:text-amber-600 transition-colors">
                    {STORE_INFO.phone}
                  </a>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Available for School Bulk Quotes, Custom Mementos, and Tender Estimates.
                </p>
              </div>
            </div>

            {/* Local Delivery Coverage Areas */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800">
                <Truck size={15} className="text-amber-600" />
                <span>Showroom Pickup & Regional Delivery Coverage:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {deliveryAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* One-Tap Action */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={directMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md text-sm"
              >
                <Navigation size={18} className="text-amber-400" />
                <span>Get Driving Directions</span>
              </a>

              <a
                href={`tel:${STORE_INFO.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-6 rounded-2xl transition-all text-sm"
              >
                <Phone size={17} />
                <span>Call Showroom</span>
              </a>
            </div>

          </div>

          {/* Interactive Map Embed Column */}
          <div className="lg:col-span-7 h-80 sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative group">
            <iframe
              title="Trophy Mall Pondicherry Location"
              src="https://maps.google.com/maps?q=Lawspet+Airport+Road+Rajaji+Nagar+Puducherry&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
            />
            
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-md text-[11px] font-bold text-slate-800 pointer-events-none flex items-center gap-1.5">
              <MapPin size={13} className="text-amber-600" />
              <span>Trophy Mall • Lawspet, Pondicherry</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
