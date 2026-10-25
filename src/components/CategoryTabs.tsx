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
    <div className="overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max p-0.5">
        {CATEGORIES.map((category) => {
          const Icon = getIcon(category.iconName);
          const isActive = activeCategory === category.slug;
          const count = productCounts[category.slug] || 0;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/90'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-amber-400' : 'text-zinc-500'} />
              <span>{category.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'bg-zinc-100 text-zinc-500'
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
