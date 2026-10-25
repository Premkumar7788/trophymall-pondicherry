'use client';

import React from 'react';
import { 
  Trophy, 
  Award, 
  Activity, 
  Sparkles, 
  Medal, 
  Crown, 
  Shield 
} from 'lucide-react';
import { CATEGORIES } from '@/data/catalog';

interface CategoryTabsProps {
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  productCounts: Record<string, number>;
}

export default function CategoryTabs({
  activeCategory,
  onSelectCategory,
  productCounts,
}: CategoryTabsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return Trophy;
      case 'Award':
        return Award;
      case 'Activity':
        return Activity;
      case 'Sparkles':
        return Sparkles;
      case 'Medal':
        return Medal;
      case 'Crown':
        return Crown;
      case 'Shield':
        return Shield;
      default:
        return Trophy;
    }
  };

  return (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2.5 min-w-max p-1">
        {CATEGORIES.map((category) => {
          const Icon = getIcon(category.iconName);
          const isActive = activeCategory === category.slug;
          const count = productCounts[category.slug] || 0;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-slate-950' : 'text-amber-600'} />
              <span>{category.name}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                  isActive
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
