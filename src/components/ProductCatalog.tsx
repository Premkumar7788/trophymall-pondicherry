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
    <section className="py-16 bg-slate-50/60" id="catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full mb-2">
              <Trophy size={14} className="text-amber-600" />
              <span>Showroom Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Trophy & Awards Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any design to customize heights, enter laser plate engraving, or view bulk tier discounts.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> awards in stock
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            productCounts={productCounts}
          />
        </div>

        {/* Search, Material Filter & Sort Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Field */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search cricket, football, acrylic, medals, wooden crests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Material & Sort Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Material dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 whitespace-nowrap">
                <Layers size={14} className="text-amber-600" /> Material:
              </span>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-amber-500"
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 whitespace-nowrap">
                <ArrowUpDown size={14} className="text-amber-600" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-amber-500"
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
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors whitespace-nowrap"
                title="Reset all filters"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCustomize={onCustomize}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No matching awards found
            </h3>
            <p className="text-xs text-slate-500">
              We have over 500+ physical samples in our Lawspet showroom. If you don&apos;t see what you need, message us directly for custom designs.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
