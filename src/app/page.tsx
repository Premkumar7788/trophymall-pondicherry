'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ShowroomHighlights from '@/components/ShowroomHighlights';
import ProductCatalog from '@/components/ProductCatalog';
import ProductCustomizerModal from '@/components/ProductCustomizerModal';
import QuoteModal from '@/components/QuoteModal';
import ShowroomSection from '@/components/ShowroomSection';
import InstitutionalTenderForm from '@/components/InstitutionalTenderForm';
import Footer from '@/components/Footer';
import { Product, CustomizationDetails, QuoteItem } from '@/types';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  const handleOpenCustomizer = (product: Product) => {
    setSelectedProduct(product);
    setIsCustomizerOpen(true);
  };

  const handleCloseCustomizer = () => {
    setIsCustomizerOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToQuote = (
    customization: CustomizationDetails,
    unitPrice: number,
    totalPrice: number
  ) => {
    if (!selectedProduct) return;
    setQuoteItems((prev) => [
      ...prev,
      {
        product: selectedProduct,
        customization,
        unitPrice,
        totalPrice,
      },
    ]);
  };

  const handleGenerateDirectQuote = (
    customization: CustomizationDetails,
    unitPrice: number,
    totalPrice: number
  ) => {
    if (!selectedProduct) return;
    // Add to items and immediately open the quote modal
    setQuoteItems([
      {
        product: selectedProduct,
        customization,
        unitPrice,
        totalPrice,
      },
    ]);
    setIsCustomizerOpen(false);
    setIsQuoteModalOpen(true);
  };

  const handleRemoveQuoteItem = (index: number) => {
    setQuoteItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAllQuotes = () => {
    setQuoteItems([]);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header / Navbar */}
      <Header
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        quoteCount={quoteItems.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCatalog={scrollToCatalog}
          onOpenInstitutionalQuote={() => setIsQuoteModalOpen(true)}
        />

        {/* 4 Pillars / Showroom Advantages */}
        <ShowroomHighlights />

        {/* Dynamic Product Catalog & Filtering */}
        <ProductCatalog onCustomize={handleOpenCustomizer} />

        {/* Institutional & Bulk Tender Form */}
        <InstitutionalTenderForm />

        {/* Physical Showroom & Google Maps Location */}
        <ShowroomSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Customizer Modal */}
      <ProductCustomizerModal
        product={selectedProduct}
        isOpen={isCustomizerOpen}
        onClose={handleCloseCustomizer}
        onAddToQuote={handleAddToQuote}
        onGenerateDirectQuote={handleGenerateDirectQuote}
      />

      {/* Institutional Printable Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        items={quoteItems}
        onRemoveItem={handleRemoveQuoteItem}
        onClearAll={handleClearAllQuotes}
      />
    </div>
  );
}
