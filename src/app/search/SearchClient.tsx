'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Sparkles, Filter, Laptop, Smartphone, Monitor, HardDrive, Cpu, MousePointer, Keyboard, Home, Headphones, Star, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { Product, Category, Review, Article } from '@/lib/seedData';

interface SearchClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
  initialReviews: Review[];
  initialArticles: Article[];
}

export default function SearchClient({
  initialCategories,
  initialProducts,
  initialReviews,
  initialArticles
}: SearchClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse initial query params
  const paramQuery = searchParams.get('query') || '';
  const paramCategory = searchParams.get('category') || '';
  const paramTab = searchParams.get('tab') || 'todos';

  const [query, setQuery] = useState(paramQuery);
  const [selectedCategory, setSelectedCategory] = useState(paramCategory);
  const [activeTab, setActiveTab] = useState(paramTab);

  // Live filter state
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<{ review: Review; product: Product }[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  // Update query states on URL change
  useEffect(() => {
    setQuery(paramQuery);
    setSelectedCategory(paramCategory);
    setActiveTab(paramTab);
  }, [paramQuery, paramCategory, paramTab]);

  // Sync state to URL params for SEO and shareable search links
  const updateURL = (newQuery: string, newCat: string, newTab: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('query', newQuery);
    if (newCat) params.set('category', newCat);
    if (newTab && newTab !== 'todos') params.set('tab', newTab);
    
    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const q = query.toLowerCase();

    // 1. Filter Products
    let prodResult = initialProducts.filter(p => p.status === 'published');
    if (q) {
      prodResult = prodResult.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      const cat = initialCategories.find(c => c.slug === selectedCategory);
      if (cat) {
        prodResult = prodResult.filter(p => p.category_id === cat.id);
      }
    }
    setFilteredProducts(prodResult);

    // 2. Filter Reviews
    let revResult = initialReviews.map(rev => {
      const prod = initialProducts.find(p => p.id === rev.product_id);
      return { review: rev, product: prod! };
    }).filter(item => item.product !== undefined);

    if (q) {
      revResult = revResult.filter(
        item => item.product.name.toLowerCase().includes(q) || item.review.summary.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      const cat = initialCategories.find(c => c.slug === selectedCategory);
      if (cat) {
        revResult = revResult.filter(item => item.product.category_id === cat.id);
      }
    }
    setFilteredReviews(revResult);

    // 3. Filter Articles
    let artResult = initialArticles.filter(a => a.status === 'published');
    if (q) {
      artResult = artResult.filter(
        a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      const cat = initialCategories.find(c => c.slug === selectedCategory);
      if (cat) {
        artResult = artResult.filter(a => a.category_id === cat.id);
      }
    }
    setFilteredArticles(artResult);

  }, [query, selectedCategory, initialProducts, initialReviews, initialArticles, initialCategories]);

  // Clean filters
  const handleClearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setActiveTab('todos');
    router.push('/search');
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="h-4 w-4" />;
      case 'Smartphone': return <Smartphone className="h-4 w-4" />;
      case 'Monitor': return <Monitor className="h-4 w-4" />;
      case 'HardDrive': return <HardDrive className="h-4 w-4" />;
      case 'Cpu': return <Cpu className="h-4 w-4" />;
      case 'MousePointer': return <MousePointer className="h-4 w-4" />;
      case 'Keyboard': return <Keyboard className="h-4 w-4" />;
      case 'Home': return <Home className="h-4 w-4" />;
      case 'Headphones': return <Headphones className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Busca de Conteúdo</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Encontre análises de produtos, comparativos técnicos ou notícias e guias.</p>
      </div>

      {/* Unified Search Input */}
      <div className="relative">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="O que você deseja pesquisar hoje? Ex: MacBook Air M3"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateURL(e.target.value, selectedCategory, activeTab);
          }}
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-blue focus:outline-none shadow-sm text-base sm:text-lg transition-all"
        />
      </div>

      {/* Category Pills Slider */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filtrar por Categoria</span>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setSelectedCategory('');
              updateURL(query, '', activeTab);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              !selectedCategory 
                ? 'bg-brand-blue border-brand-blue text-white shadow-sm'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            Todas as Categorias
          </button>
          
          {initialCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                updateURL(query, cat.slug, activeTab);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-brand-blue border-brand-blue text-white shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex gap-6 text-sm font-semibold">
          {[
            { id: 'todos', name: 'Todos' },
            { id: 'produtos', name: `Produtos (${filteredProducts.length})` },
            { id: 'reviews', name: `Reviews (${filteredReviews.length})` },
            { id: 'artigos', name: `Artigos (${filteredArticles.length})` },
            { id: 'categorias', name: 'Categorias' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                updateURL(query, selectedCategory, tab.id);
              }}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER BODY RESULTS */}
      <div className="space-y-6">
        
        {/* Helper clean up button */}
        {(query || selectedCategory) && (
          <div className="flex items-center justify-between bg-brand-blue/5 border border-brand-blue/10 rounded-lg p-3 text-xs text-brand-blue">
            <span>
              Filtrado por: {query && `"${query}"`} {selectedCategory && `em [${selectedCategory}]`}
            </span>
            <button 
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 font-bold underline cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Limpar Filtros</span>
            </button>
          </div>
        )}

        {/* 1. TAB: TODOS */}
        {activeTab === 'todos' && (
          <div className="space-y-8">
            
            {/* Products grid */}
            {filteredProducts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Produtos recomendados</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredProducts.slice(0, 3).map(prod => (
                    <div key={prod.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700/80 transition-colors">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{prod.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                        <span className="font-bold text-brand-blue">R$ {prod.price.toLocaleString('pt-BR')}</span>
                        <Link href={`/produtos/${prod.slug}`} className="font-semibold text-slate-400 hover:text-brand-blue transition-colors">Ver Onde Comprar →</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews list */}
            {filteredReviews.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reviews Completas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredReviews.slice(0, 4).map(({ review, product }) => (
                    <div key={review.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{product.name}</h3>
                        <div className="flex items-center gap-1 rounded bg-slate-900 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-amber-400 shrink-0">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{review.summary}</p>
                      <Link href={`/reviews/${product.slug}`} className="inline-block text-xs font-semibold text-brand-blue hover:underline">Ler Review Completa →</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Articles list */}
            {filteredArticles.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Artigos & Guias de Compra</h2>
                <div className="space-y-3">
                  {filteredArticles.slice(0, 3).map(art => (
                    <div key={art.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card flex justify-between items-center gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-blue transition-colors">
                          <Link href={`/artigos/${art.slug}`}>{art.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">{art.summary}</p>
                      </div>
                      <Link href={`/artigos/${art.slug}`} className="text-slate-400 hover:text-brand-blue shrink-0"><ArrowRight className="h-4 w-4" /></Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredProducts.length === 0 && filteredReviews.length === 0 && filteredArticles.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                Nenhum resultado encontrado para esta busca.
              </div>
            )}

          </div>
        )}

        {/* 2. TAB: PRODUTOS */}
        {activeTab === 'produtos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(prod => (
                <div key={prod.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                  <div className="space-y-3">
                    <div className="aspect-square bg-slate-900/50 rounded-lg overflow-hidden relative">
                      <img src={prod.image_url} alt={prod.name} className="object-cover h-full w-full" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{prod.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3">{prod.description}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-base font-extrabold text-brand-blue">R$ {prod.price.toLocaleString('pt-BR')}</span>
                    <Link href={`/produtos/${prod.slug}`} className="rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue hover:text-white px-3 py-1.5 font-bold transition-all text-[11px]">Onde comprar →</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 text-slate-500">
                Nenhum produto cadastrado corresponde aos critérios.
              </div>
            )}
          </div>
        )}

        {/* 3. TAB: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map(({ review, product }) => (
                <div key={review.id} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">Review Técnico</span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">{product.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-slate-900 border border-slate-700/60 px-2.5 py-1 text-xs font-bold text-amber-400 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-3">{review.summary}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">Nota técnica: {review.rating}/10</span>
                    <Link href={`/reviews/${product.slug}`} className="font-semibold text-brand-blue flex items-center gap-1 hover:translate-x-0.5 transition-transform">
                      <span>Ler Review Completo</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-16 text-slate-500">
                Nenhum review cadastrado para a pesquisa.
              </div>
            )}
          </div>
        )}

        {/* 4. TAB: ARTIGOS */}
        {activeTab === 'artigos' && (
          <div className="space-y-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map(art => (
                <div key={art.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card flex flex-col md:flex-row gap-5 items-start">
                  <div className="relative h-28 w-full md:w-36 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                    <img src={art.image_url} alt={art.title} className="object-cover h-full w-full" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                      <span>Por {art.author_name}</span>
                      <span>•</span>
                      <span>{art.read_time} min de leitura</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-brand-blue transition-colors">
                      <Link href={`/artigos/${art.slug}`}>{art.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{art.summary}</p>
                    <Link href={`/artigos/${art.slug}`} className="inline-flex items-center gap-1 text-xs text-brand-blue font-bold pt-1 hover:underline">
                      <span>Ler Guia Completo</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-500">
                Nenhum artigo encontrado.
              </div>
            )}
          </div>
        )}

        {/* 5. TAB: CATEGORIAS */}
        {activeTab === 'categorias' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {initialCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setActiveTab('todos');
                  updateURL(query, cat.slug, 'todos');
                }}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card hover:border-brand-blue hover:scale-[1.02] cursor-pointer transition-all text-left space-y-2"
              >
                <div className="h-9 w-9 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">{cat.description}</p>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
