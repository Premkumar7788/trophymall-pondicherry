import React from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Clock, 
  ExternalLink, 
  Truck, 
  Navigation,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { STORE_INFO, SHOWROOM_GALLERY_IMAGES } from '@/data/catalog';
import BrandLogo from './BrandLogo';

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
    'Kalapet',
    'Auroville',
    'Cuddalore',
    'Villupuram',
  ];

  return (
    <section className="py-16 bg-white border-t border-zinc-200/80" id="showroom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
            Physical Showroom & Atelier
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-3 tracking-tight">
            Visit Trophy Mall in Pondicherry
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-2">
            Examine trophy finishes, explore 500+ physical display samples, and review laser-engraved proof plaques in person before your event.
          </p>
        </div>

        {/* Main Showroom Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-zinc-50/70 p-6 sm:p-8 rounded-3xl border border-zinc-200/80">
          
          {/* Details Column */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Perfectly Aligned Shop Name & Logo Lockup */}
            <div className="pb-4 border-b border-zinc-200/80">
              <BrandLogo size="md" />
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-white border border-zinc-200 text-zinc-800 rounded-xl shrink-0 shadow-xs">
                <MapPin size={20} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 text-sm">Showroom Address</h4>
                <p className="text-xs font-medium text-zinc-700 mt-1 leading-snug">
                  {STORE_INFO.address}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Landmark: {STORE_INFO.landmarks}
                </p>
                <div className="flex items-center gap-3 mt-2.5">
                  <a
                    href={directMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200/70 transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink size={11} />
                  </a>

                  <a
                    href={shareMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 underline"
                  >
                    <span>Short Link</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-white border border-zinc-200 text-zinc-800 rounded-xl shrink-0 shadow-xs">
                <Clock size={20} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 text-sm">Business Hours</h4>
                <p className="text-xs text-zinc-600 mt-1">
                  <strong>Monday – Saturday:</strong> 10:00 AM – 9:00 PM<br />
                  <strong>Sunday:</strong> Prior Appointment / Urgent Tournament Pickups
                </p>
              </div>
            </div>

            {/* Direct Inquiries & Phone */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-white border border-zinc-200 text-zinc-800 rounded-xl shrink-0 shadow-xs">
                <PhoneCall size={20} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 text-sm">Direct Showroom Hotline</h4>
                <p className="text-xs font-semibold text-zinc-900 mt-1">
                  <a href={`tel:${STORE_INFO.phone}`} className="hover:text-amber-700 transition-colors">
                    {STORE_INFO.phone}
                  </a>
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Direct line for school bulk quotes, event orders & tenders.
                </p>
              </div>
            </div>

            {/* Local Delivery Coverage Areas */}
            <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/80">
              <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-zinc-800">
                <Truck size={14} className="text-amber-600" />
                <span>Showroom Pickup & Regional Delivery Areas:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {deliveryAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-zinc-50 border border-zinc-200/80 px-2 py-0.5 rounded text-zinc-600 font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* One-Tap Action */}
            <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
              <a
                href={directMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white font-semibold py-3 px-5 rounded-xl transition-all shadow-xs text-xs uppercase tracking-wider"
              >
                <Navigation size={15} />
                <span>Get Driving Directions</span>
              </a>

              <a
                href={`tel:${STORE_INFO.phone}`}
                className="inline-flex items-center justify-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold py-3 px-5 rounded-xl transition-all text-xs"
              >
                <PhoneCall size={14} />
                <span>Call Showroom</span>
              </a>
            </div>

          </div>

          {/* Interactive Map Embed Column - Direct to Trophy Mall Pondicherry Place ID */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-72 sm:h-84 rounded-2xl overflow-hidden border border-zinc-200 shadow-xs relative">
              <iframe
                title="Trophy Mall Pondicherry Google Maps Listing"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.351659223789!2d79.8266282!3d11.9403051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361b97ade1595%3A0x170addcfe6bf616b!2sTrophy%20Mall!5e0!3m2!1sen!2sin!4v1716000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
              />
            </div>

            {/* Showroom Photo Gallery Strip */}
            <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-600" />
                  Showroom Collection Highlights
                </span>
                <a
                  href={directMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-zinc-500 hover:text-zinc-800 underline"
                >
                  View 50+ Photos on Google Maps
                </a>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {SHOWROOM_GALLERY_IMAGES.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/80">
                    <Image
                      src={img.url}
                      alt={img.caption}
                      fill
                      sizes="150px"
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
