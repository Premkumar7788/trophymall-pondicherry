'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ExternalLink, 
  MessageSquare, 
  ArrowLeft,
  LogOut,
  Save
} from 'lucide-react';
import { Product } from '@/types';
import { STORE_INFO, CATEGORIES } from '@/data/catalog';
import BrandLogo from '@/components/BrandLogo';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  resetStoredProducts, 
  parseWhatsAppCSV, 
  generateSampleWhatsAppCSV,
  getStoredInquiries,
  StoredInquiry
} from '@/lib/catalogStore';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'sync' | 'products' | 'inquiries'>('sync');
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<StoredInquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // CSV Sync states
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedPreview, setParsedPreview] = useState<Product[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('450');
  const [newMrp, setNewMrp] = useState('650');
  const [newCategory, setNewCategory] = useState('cricket');
  const [newMaterial, setNewMaterial] = useState('Metal & Fiber');
  const [newHeight, setNewHeight] = useState('12 inch');
  const [newImage, setNewImage] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editTitle, setEditTitle] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication check
  useEffect(() => {
    const auth = sessionStorage.getItem('trophymall_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load products & inquiries when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setProducts(getStoredProducts());
      getStoredInquiries().then(setInquiries);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || 'trophy2026';
    if (pinInput.trim() === correctPin || pinInput.trim() === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('trophymall_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('trophymall_admin_auth');
    setPinInput('');
  };

  // CSV File Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setSyncSuccess(false);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const { products: parsed, errors } = parseWhatsAppCSV(text);
          setParsedPreview(parsed);
          setParseErrors(errors);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmSync = async () => {
    if (parsedPreview.length === 0) return;
    setIsSyncing(true);
    await saveStoredProducts(parsedPreview);
    setProducts(parsedPreview);
    setIsSyncing(false);
    setSyncSuccess(true);
  };

  const handleDownloadSampleCSV = () => {
    const csvContent = generateSampleWhatsAppCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'whatsapp_catalog_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadSampleCSV = () => {
    const csvContent = generateSampleWhatsAppCSV();
    const { products: parsed, errors } = parseWhatsAppCSV(csvContent);
    setParsedPreview(parsed);
    setParseErrors(errors);
    setSyncSuccess(false);
  };

  const handleResetCatalog = () => {
    if (confirm('Are you sure you want to reset the catalog to showroom factory defaults? Any custom uploaded products will be reverted.')) {
      const reset = resetStoredProducts();
      setProducts(reset);
      setParsedPreview([]);
      setSyncSuccess(false);
      alert('Catalog has been reset to default showroom items.');
    }
  };

  // Add Product Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryObj = CATEGORIES.find((c) => c.slug === newCategory) || CATEGORIES[1];
    
    const newProd: Product = {
      id: `manual-${Date.now()}`,
      categoryId: categoryObj.id,
      categorySlug: categoryObj.slug,
      name: newTitle,
      slug: `${newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      basePrice: parseFloat(newPrice) || 450,
      mrp: parseFloat(newMrp) || 650,
      material: newMaterial,
      heightInches: newHeight,
      heightOptions: [newHeight, '14 inch', '18 inch'],
      description: newDescription || `${newTitle} with free laser plate engraving at Trophy Mall Pondicherry.`,
      images: [newImage || 'https://trophymall.shop/wp-content/uploads/2026/08/Sports-Trophies-Cover-768x768.png'],
      isCustomizable: true,
      isBestseller: false,
      isExpress24h: true,
      stockStatus: 'in_stock',
      bulkPricing: [
        { minQty: 10, maxQty: 19, discountPercent: 10 },
        { minQty: 20, maxQty: 49, discountPercent: 15 },
        { minQty: 50, discountPercent: 25 },
      ],
    };

    const updated = [newProd, ...products];
    await saveStoredProducts(updated);
    setProducts(updated);
    setIsAddModalOpen(false);

    // Reset fields
    setNewTitle('');
    setNewPrice('450');
    setNewMrp('650');
    setNewImage('');
    setNewDescription('');
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Delete this product from the live catalog?')) {
      const updated = products.filter((p) => p.id !== id);
      await saveStoredProducts(updated);
      setProducts(updated);
    }
  };

  // Quick Inline Edit Save
  const handleSaveInlineEdit = async (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          name: editTitle || p.name,
          basePrice: parseFloat(editPrice) || p.basePrice,
        };
      }
      return p;
    });
    await saveStoredProducts(updated);
    setProducts(updated);
    setEditingId(null);
  };

  // Toggle Stock Status
  const handleToggleStock = async (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          stockStatus: (p.stockStatus === 'in_stock' ? 'made_to_order' : 'in_stock') as 'in_stock' | 'made_to_order',
        };
      }
      return p;
    });
    await saveStoredProducts(updated);
    setProducts(updated);
  };

  // Filtered products list
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categorySlug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --------------------------------------------------------------------------
  // Lock Screen Render
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="flex justify-center">
            <BrandLogo size="md" theme="dark" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              Showroom Manager Portal
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Enter your shopkeeper PIN to edit catalog & sync WhatsApp products.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <input
                type="password"
                placeholder="Enter PIN (Default: trophy2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-center text-sm text-white placeholder-zinc-600 outline-none focus:border-amber-400 tracking-widest font-mono"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-400 mt-2 font-medium">
                  Incorrect PIN. Try PIN `trophy2026` or use 1-Click Quick Unlock below.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Unlock Dashboard
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(true);
                sessionStorage.setItem('trophymall_admin_auth', 'true');
                setPinError(false);
              }}
              className="w-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>⚡ 1-Click Quick Unlock (Owner / Demo)</span>
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
            <p className="mb-2 text-zinc-400">Default PIN: <code className="text-amber-400 font-mono">trophy2026</code> or <code className="text-amber-400 font-mono">admin123</code></p>
            <Link href="/" className="hover:text-zinc-300 transition-colors flex items-center justify-center gap-1">
              <ArrowLeft size={12} />
              <span>Back to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Authenticated Admin Dashboard
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-zinc-950 text-white border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" theme="dark" />
            <span className="text-zinc-600">|</span>
            <span className="text-xs font-semibold text-zinc-300">Catalog Manager</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 transition-colors"
            >
              <span>View Live Store</span>
              <ExternalLink size={12} />
            </Link>

            <a
              href={`https://wa.me/c/${STORE_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-950 bg-emerald-950/40 hover:bg-emerald-950/80 transition-colors"
            >
              <span>WhatsApp Catalog</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Lock Admin Portal"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sync')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sync'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              <Upload size={14} className={activeTab === 'sync' ? 'text-amber-400' : 'text-zinc-500'} />
              <span>WhatsApp CSV Sync</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              <Trophy size={14} className={activeTab === 'products' ? 'text-amber-400' : 'text-zinc-500'} />
              <span>All Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              <MessageSquare size={14} className={activeTab === 'inquiries' ? 'text-amber-400' : 'text-zinc-500'} />
              <span>Customer Inquiries ({inquiries.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>Add New Trophy</span>
            </button>

            <button
              onClick={handleResetCatalog}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-100 transition-colors"
              title="Reset to showroom defaults"
            >
              <RefreshCw size={13} />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* TAB 1: WHATSAPP CSV SYNC ENGINE */}
        {/* ================================================================== */}
        {activeTab === 'sync' && (
          <div className="space-y-6">
            
            {/* Sync Instructions Card */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900">
                    Sync WhatsApp Business Catalog via CSV
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xl">
                    Export your catalog from WhatsApp Business or Meta Commerce Manager as a CSV file, then upload it below. The website will parse prices, photos, and descriptions automatically.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleLoadSampleCSV}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors shrink-0"
                  >
                    <RefreshCw size={14} className="text-amber-700" />
                    <span>⚡ Load Sample WhatsApp Catalog (1-Click Test)</span>
                  </button>

                  <button
                    onClick={handleDownloadSampleCSV}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-colors shrink-0"
                  >
                    <Download size={14} className="text-zinc-600" />
                    <span>Download Sample CSV Template</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl p-8 text-center transition-colors bg-zinc-50/50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-file-upload"
                />
                
                <div className="max-w-sm mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center mx-auto shadow-xs">
                    <Upload size={22} className="text-amber-600" />
                  </div>
                  <div>
                    <label
                      htmlFor="csv-file-upload"
                      className="cursor-pointer text-xs font-bold text-zinc-900 hover:underline"
                    >
                      Click to choose WhatsApp Catalog CSV
                    </label>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Supports Meta Commerce CSV, Shopify CSV, or custom spreadsheet exports
                    </p>
                  </div>
                  {csvFile && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>{csvFile.name} (Ready to parse)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Parse Errors if any */}
              {parseErrors.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertCircle size={15} />
                    <span>CSV Warning:</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-rose-700">
                    {parseErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sync Success Banner */}
              {syncSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-bold">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span>Catalog Successfully Synced! The public storefront is now showing {products.length} updated products.</span>
                  </div>
                  <Link
                    href="/"
                    target="_blank"
                    className="text-xs font-extrabold text-emerald-800 underline flex items-center gap-1"
                  >
                    <span>View Store</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              )}
            </div>

            {/* Parsed Preview Table */}
            {parsedPreview.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-900">
                      Parsed Products Preview ({parsedPreview.length} Items)
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Review products before confirming sync to the public showroom catalog.
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmSync}
                    disabled={isSyncing}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    <CheckCircle2 size={15} />
                    <span>{isSyncing ? 'Syncing...' : 'Confirm & Sync to Live Website'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-700 font-bold uppercase text-[10px]">
                        <th className="py-2.5 px-3">Photo</th>
                        <th className="py-2.5 px-3">Title / Name</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Base Price</th>
                        <th className="py-2.5 px-3 text-right">MRP</th>
                        <th className="py-2.5 px-3 text-center">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {parsedPreview.map((item, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/60">
                          <td className="py-2.5 px-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 relative">
                              <Image
                                src={item.images[0]}
                                alt={item.name}
                                fill
                                sizes="40px"
                                className="object-contain p-1"
                              />
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-zinc-900 max-w-xs truncate">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 text-zinc-600">
                            <span className="px-2 py-0.5 rounded bg-zinc-100 font-medium text-[10px]">
                              {item.categorySlug}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-zinc-900">
                            ₹{item.basePrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-right text-zinc-400 line-through">
                            ₹{item.mrp.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                              {item.stockStatus === 'in_stock' ? 'In Stock' : 'Made to Order'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleConfirmSync}
                    disabled={isSyncing}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-colors"
                  >
                    <CheckCircle2 size={16} />
                    <span>{isSyncing ? 'Syncing...' : `Confirm & Publish ${parsedPreview.length} Products to Website`}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: SHOWROOM INVENTORY & MANUAL EDITING */}
        {/* ================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Search and stats bar */}
            <div className="bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter by title or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-800 outline-none focus:border-zinc-400"
                />
              </div>

              <div className="text-xs text-zinc-500">
                Displaying <strong className="text-zinc-900">{filteredProducts.length}</strong> of {products.length} products
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-700 font-bold uppercase text-[10px]">
                      <th className="py-3 px-3">Item</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 text-right">Base Price</th>
                      <th className="py-3 px-3 text-right">MRP</th>
                      <th className="py-3 px-3 text-center">Stock Status</th>
                      <th className="py-3 px-3 text-center">Express</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredProducts.map((p) => {
                      const isEditing = editingId === p.id;

                      return (
                        <tr key={p.id} className="hover:bg-zinc-50/70 transition-colors">
                          {/* Image & Title */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 relative">
                                <Image
                                  src={p.images[0]}
                                  alt={p.name}
                                  fill
                                  sizes="40px"
                                  className="object-contain p-1"
                                />
                              </div>
                              <div className="max-w-xs">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="text-xs font-bold bg-white border border-zinc-300 rounded px-2 py-1 w-full"
                                  />
                                ) : (
                                  <div className="font-bold text-zinc-900 truncate">
                                    {p.name}
                                  </div>
                                )}
                                <div className="text-[10px] text-zinc-400">
                                  Height: {p.heightInches} • {p.material}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded font-medium text-zinc-600">
                              {p.categorySlug}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-2.5 px-3 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1">
                                <span>₹</span>
                                <input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="text-xs font-bold bg-white border border-zinc-300 rounded px-1.5 py-0.5 w-16 text-right"
                                />
                              </div>
                            ) : (
                              <span className="font-black text-zinc-900">
                                ₹{p.basePrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </td>

                          {/* MRP */}
                          <td className="py-2.5 px-3 text-right text-zinc-400 line-through">
                            ₹{p.mrp.toLocaleString('en-IN')}
                          </td>

                          {/* Stock Toggle */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => handleToggleStock(p.id)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                                p.stockStatus === 'in_stock'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200'
                              }`}
                            >
                              {p.stockStatus === 'in_stock' ? 'In Stock' : 'Made to Order'}
                            </button>
                          </td>

                          {/* Express Tag */}
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                p.isExpress24h
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-zinc-100 text-zinc-400'
                              }`}
                            >
                              {p.isExpress24h ? '24h Yes' : 'Standard'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isEditing ? (
                                <button
                                  onClick={() => handleSaveInlineEdit(p.id)}
                                  className="p-1 text-emerald-600 hover:text-emerald-800"
                                  title="Save Changes"
                                >
                                  <Save size={15} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingId(p.id);
                                    setEditTitle(p.name);
                                    setEditPrice(p.basePrice.toString());
                                  }}
                                  className="p-1 text-zinc-500 hover:text-zinc-800"
                                  title="Edit Title & Price"
                                >
                                  <Edit3 size={14} />
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1 text-rose-500 hover:text-rose-700"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: CUSTOMER PROOF INQUIRIES */}
        {/* ================================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900">
                    Customer Inquiries & Proof Requests
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Orders and tender estimates submitted by customers through the website.
                  </p>
                </div>

                <span className="text-xs font-bold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full">
                  {inquiries.length} Inquiries Logged
                </span>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-10 text-zinc-400 italic text-xs">
                  No inquiries logged yet. When customers submit requests on the site or via WhatsApp, they will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-900">
                            {inq.customerName}
                          </span>
                          {inq.organizationName && (
                            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.2 rounded border border-amber-200/60">
                              {inq.organizationName}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-zinc-600">
                          <strong>Phone:</strong> {inq.customerPhone} • <strong>Qty:</strong> {inq.quantity} units • <strong>Fulfillment:</strong> {inq.fulfillmentType}
                        </div>

                        {inq.engravingLine1 && (
                          <div className="text-[11px] text-zinc-500 font-mono bg-white px-2 py-1 rounded border border-zinc-200/60">
                            Line 1: {inq.engravingLine1} | Line 2: {inq.engravingLine2 || 'N/A'}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <a
                          href={`https://wa.me/${inq.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.customerName)}!%20This%20is%20Trophy%20Mall%20Pondicherry%20following%20up%20on%20your%20award%20inquiry.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                        >
                          <MessageSquare size={13} />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ================================================================== */}
      {/* ADD NEW PRODUCT MODAL */}
      {/* ================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-zinc-200 max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-extrabold text-sm text-zinc-900">
                Add New Trophy to Showroom Catalog
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Product Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Premier League Cricket Star Award"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-400 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    MRP Original (₹)
                  </label>
                  <input
                    type="number"
                    value={newMrp}
                    onChange={(e) => setNewMrp(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-2 outline-none focus:border-zinc-400"
                  >
                    <option value="cricket">Cricket Trophies</option>
                    <option value="sports">Football & Sports</option>
                    <option value="corporate-acrylic">Corporate & Acrylic</option>
                    <option value="medals">Medals & Lanyards</option>
                    <option value="championship-cups">Mega Championship Cups</option>
                    <option value="mementos-crests">Mementos & Crests</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Material
                  </label>
                  <select
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-2 outline-none focus:border-zinc-400"
                  >
                    <option value="Metal & Fiber">Metal & Fiber</option>
                    <option value="Metal">Pure Metal / Brass</option>
                    <option value="Acrylic">Optical Acrylic</option>
                    <option value="Wood">Mahogany & Teakwood</option>
                    <option value="Crystal">Optical Crystal</option>
                    <option value="Resin">Sculptured Resin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    value={newHeight}
                    onChange={(e) => setNewHeight(e.target.value)}
                    placeholder="e.g. 12 inch / 2 Feet"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Product Photo (URL or Device Upload)
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Paste image link (https://...)"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-400"
                    />
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-lg text-[11px] font-medium text-zinc-700 inline-flex items-center gap-1">
                        <Upload size={12} />
                        <span>Upload photo from device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setNewImage(ev.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {newImage && (
                        <span className="text-[10px] text-emerald-600 font-semibold truncate max-w-[140px]">
                          ✓ Photo Selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Details about engraving, finish, wooden base..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl font-semibold hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-black shadow-xs"
                >
                  Save to Showroom Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
