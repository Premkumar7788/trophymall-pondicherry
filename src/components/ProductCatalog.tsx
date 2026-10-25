'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trophy, 
  RotateCcw,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Product } from '@/types';
import { PRODUCTS, CATEGORIES } from '@/data/catalog';
import CategoryTabs from './CategoryTabs';
import ProductCard from './ProductCard';

interface ProductCatalogProps {
  onCustomize: (product: Product) => void;
}

export default function ProductCatalog({ onCustomize }: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: PRODUCTS.length,
    };
    CATEGORIES.forEach((cat) => {
      if (cat.slug !== 'all') {
        counts[cat.slug] = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
      }
    });
    return counts;
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (activeCategory !== 'all' && product.categorySlug !== activeCategory) {
        return false;
      }

      // Material filter
      if (selectedMaterial !== 'all' && !product.material.toLowerCase().includes(selectedMaterial.toLowerCase())) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesMaterial = product.material.toLowerCase().includes(query);
        const matchesCategory = product.categorySlug.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesMaterial && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      // Default: featured (bestsellers first)
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }, [activeCategory, selectedMaterial, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSelectedMaterial('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section className="py-14 bg-zinc-50/50" id="catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading - Minimalist */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              <Trophy size={13} className="text-amber-600" />
              <span>Showroom Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Trophy & Awards Catalog
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Select any design to view customization options, free laser plate proofs, or bulk tier pricing.
            </p>
          </div>

          <div className="text-xs text-zinc-500">
            Showing <strong className="text-zinc-900 font-semibold">{filteredProducts.length}</strong> items in showroom
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-5">
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            productCounts={productCounts}
          />
        </div>

        {/* Search, Material Filter & Sort Bar - Minimalist */}
        <div className="bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-xs mb-7 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Field */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search cricket, football, acrylic, medals, wooden crests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200/90 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Material & Sort Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Material dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1 whitespace-nowrap">
                <Layers size={13} className="text-zinc-400" /> Material:
              </span>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="text-xs bg-zinc-50 border border-zinc-200/90 rounded-xl px-2.5 py-1.5 text-zinc-700 outline-none focus:border-zinc-400 font-medium"
              >
                <option value="all">All Materials</option>
                <option value="Metal">Metal / Brass</option>
                <option value="Acrylic">Optical Acrylic</option>
                <option value="Wood">Mahogany & Teakwood</option>
                <option value="Crystal">Optical Crystal</option>
                <option value="Resin">Sculptured Resin</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1 whitespace-nowrap">
                <ArrowUpDown size={13} className="text-zinc-400" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                className="text-xs bg-zinc-50 border border-zinc-200/90 rounded-xl px-2.5 py-1.5 text-zinc-700 outline-none focus:border-zinc-400 font-medium"
              >
                <option value="featured">Featured & Bestsellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Clear Button if filtered */}
            {(activeCategory !== 'all' || selectedMaterial !== 'all' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors whitespace-nowrap"
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCustomize={onCustomize}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-10 text-center max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto">
              <Search size={22} />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              No matching awards found
            </h3>
            <p className="text-xs text-zinc-500">
              We have 500+ physical samples in our Lawspet showroom. If you don&apos;t see what you need, message us directly for custom designs.
            </p>
            <div className="pt-1 flex justify-center">
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-black"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
