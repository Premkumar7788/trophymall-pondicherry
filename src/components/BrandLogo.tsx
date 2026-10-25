'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trophy } from 'lucide-react';
import { useStoreSettings } from '@/lib/storeSettings';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  showSubtitle?: boolean;
}

export default function BrandLogo({
  size = 'md',
  theme = 'light',
  showSubtitle = true,
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);
  const store = useStoreSettings();

  const sizeConfigs = {
    sm: {
      box: 'w-8 h-8 rounded-lg',
      imgSize: 32,
      iconSize: 18,
      title: 'text-sm font-black',
      subtitle: 'text-[8px] tracking-[0.2em] mt-0.5',
      gap: 'gap-2.5',
    },
    md: {
      box: 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl',
      imgSize: 44,
      iconSize: 22,
      title: 'text-lg sm:text-xl font-black tracking-tight',
      subtitle: 'text-[9px] sm:text-[10px] font-bold tracking-[0.22em] mt-1',
      gap: 'gap-3',
    },
    lg: {
      box: 'w-14 h-14 rounded-2xl',
      imgSize: 56,
      iconSize: 28,
      title: 'text-2xl font-black tracking-tight',
      subtitle: 'text-xs font-bold tracking-[0.25em] mt-1',
      gap: 'gap-3.5',
    },
  };

  const config = sizeConfigs[size];
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center ${config.gap} select-none`}>
      {/* Logo Mark Container with Pixel-Perfect Flex Centering */}
      <div
        className={`${config.box} bg-amber-500/10 border border-amber-500/20 flex items-center justify-center overflow-hidden shrink-0 transition-transform group-hover:scale-105`}
      >
        {!imgError ? (
          <Image
            src={store.logoUrl}
            alt={`${store.name} ${store.location}`}
            width={config.imgSize}
            height={config.imgSize}
            className="w-full h-full object-contain p-1"
            onError={() => setImgError(true)}
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950">
            <Trophy size={config.iconSize} className="stroke-[2.2]" />
          </div>
        )}
      </div>

      {/* Typography Lockup: Vertically Centered with Even Leading */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`${config.title} ${
            isDark ? 'text-white' : 'text-slate-900'
          } leading-none`}
        >
          TROPHY MALL
        </span>
        {showSubtitle && (
          <span
            className={`${config.subtitle} uppercase font-bold text-amber-600 leading-none`}
          >
            Puducherry
          </span>
        )}
      </div>
    </div>
  );
}
