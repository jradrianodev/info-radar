'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sparkles, Menu, X, Laptop, Smartphone, Monitor, HardDrive, Keyboard, AudioWaveform as Waveform, Settings } from 'lucide-react';
import { dbService } from '@/lib/db';
import { Product, Review, Article } from '@/lib/seedData';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    products: Product[];
    reviews: Review[];
    articles: Article[];
  }>({ products: [], reviews: [], articles: [] });

  // Close menus on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [pathname]);

  // Handle ESC key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Perform search query
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults({ products: [], reviews: [], articles: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Run search on mockDb (via dbService)
    const runSearch = async () => {
      const allProducts = await dbService.getProducts();
      const allReviews = await dbService.getReviews();
      const allArticles = await dbService.getArticles();

      const matchedProducts = allProducts.filter(
        p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );

      const matchedReviews = allReviews.filter(r => {
        const prod = allProducts.find(p => p.id === r.product_id);
        return prod?.name.toLowerCase().includes(query) || r.summary.toLowerCase().includes(query);
      });

      const matchedArticles = allArticles.filter(
        a => a.title.toLowerCase().includes(query) || a.summary.toLowerCase().includes(query)
      );

      setSearchResults({
        products: matchedProducts,
        reviews: matchedReviews,
        articles: matchedArticles
      });
    };

    const delayDebounce = setTimeout(() => {
      runSearch();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categorias', href: '/search?tab=categorias' },
    { name: 'Comparativos', href: '/comparativos' },
    { name: 'Reviews', href: '/search?tab=reviews' },
    { name: 'Artigos', href: '/search?tab=artigos' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/5 glass-effect">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue text-white shadow-lg glow-blue group-hover:scale-105 transition-transform">
              {/* Radar needle icon matching logo concept */}
              <div className="absolute inset-1 border border-white/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 h-4 w-4 -mt-2 -ml-2 rounded-full border border-white/40 border-t-white animate-spin [animation-duration:10s]" />
              <Sparkles className="h-4 w-4 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-light tracking-tight text-slate-900 dark:text-white leading-none">
                Info<span className="font-bold text-brand-blue">Radar</span>
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                Encontre o melhor
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-blue ${
                  pathname === link.href ? 'text-brand-blue' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Glowing Radar IA Link */}
            <Link
              href="/radar-ia"
              className="relative flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3.5 py-1.5 text-xs font-semibold text-brand-blue border border-brand-blue/20 hover:bg-brand-blue/20 transition-all shadow-sm group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/0 via-white/10 to-brand-blue/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Radar IA</span>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
              </span>
            </Link>
          </nav>

          {/* Search Trigger and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 text-xs text-slate-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Buscar tecnologia...</span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                ESC
              </kbd>
            </button>

            <Link
              href="/admin/dashboard"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
              title="Painel Admin"
            >
              <Settings className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 md:hidden hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark px-4 py-4 space-y-3 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-sm font-medium py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/radar-ia"
              className="flex items-center gap-2 text-sm font-semibold py-2.5 px-3 rounded-lg bg-brand-blue/15 text-brand-blue"
            >
              <Sparkles className="h-4 w-4 text-brand-blue" />
              <span>Radar IA (Recomendador Inteligente)</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <Settings className="h-4 w-4 text-slate-500" />
              <span>Configurações SuperAdmin</span>
            </Link>
          </div>
        )}
      </header>

      {/* Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-20 sm:pt-32">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark shadow-2xl animate-scale-in max-h-[70vh] flex flex-col">
            
            {/* Input bar */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
              <Search className="h-5 w-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Pesquise por produtos, reviews, marcas ou artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {searchQuery.trim().length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Sparkles className="h-8 w-8 text-brand-blue mx-auto mb-2 opacity-50 animate-pulse" />
                  <p className="text-sm font-medium">O que você está procurando hoje?</p>
                  <p className="text-xs text-slate-500">Tente buscar por "Macbook", "SSD", "Ultra", ou navegue pelo Radar IA.</p>
                </div>
              ) : (
                <>
                  {/* Matching Products */}
                  {searchResults.products.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Produtos ({searchResults.products.length})</h3>
                      <div className="space-y-1">
                        {searchResults.products.map(prod => (
                          <Link
                            key={prod.id}
                            href={`/produtos/${prod.slug}`}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-sm"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200">{prod.name}</span>
                            <span className="text-xs text-brand-blue font-bold">R$ {prod.price.toLocaleString('pt-BR')}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Reviews */}
                  {searchResults.reviews.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Reviews ({searchResults.reviews.length})</h3>
                      <div className="space-y-1">
                        {searchResults.reviews.map(rev => (
                          <Link
                            key={rev.id}
                            href={`/reviews/${rev.id}`}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-sm"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200">{rev.summary.substring(0, 75)}...</span>
                            <span className="text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20">Nota {rev.rating}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Articles */}
                  {searchResults.articles.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Artigos / Guias ({searchResults.articles.length})</h3>
                      <div className="space-y-1">
                        {searchResults.articles.map(art => (
                          <Link
                            key={art.id}
                            href={`/artigos/${art.slug}`}
                            className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-sm"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200 block">{art.title}</span>
                            <span className="text-xs text-slate-400 block line-clamp-1">{art.summary}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.products.length === 0 &&
                   searchResults.reviews.length === 0 &&
                   searchResults.articles.length === 0 && (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      Nenhum resultado encontrado para "<span className="font-semibold text-slate-700 dark:text-slate-300">{searchQuery}</span>".
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Footer hints */}
            <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/30 flex justify-between items-center text-[10px] text-slate-400">
              <span>Selecione um resultado para navegar</span>
              <span>Pressione <kbd className="border border-slate-300 dark:border-slate-700 rounded px-1">ESC</kbd> para sair</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
