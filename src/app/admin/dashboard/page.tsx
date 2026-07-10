import React from 'react';
import { dbService } from '@/lib/db';
import { ShoppingBag, FileText, MessageSquare, Tag, Eye, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  // Load dynamic data counts
  const categories = await dbService.getCategories();
  const products = await dbService.getProducts();
  const reviews = await dbService.getReviews();
  const articles = await dbService.getArticles();

  const stats = [
    { name: 'Produtos Ativos', count: products.length, icon: <ShoppingBag className="h-5 w-5 text-brand-blue" />, bg: 'bg-brand-blue/10 border-brand-blue/20' },
    { name: 'Categorias', count: categories.length, icon: <Tag className="h-5 w-5 text-purple-500" />, bg: 'bg-purple-500/10 border-purple-500/20' },
    { name: 'Reviews Feitos', count: reviews.length, icon: <MessageSquare className="h-5 w-5 text-emerald-500" />, bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Artigos Publicados', count: articles.length, icon: <FileText className="h-5 w-5 text-indigo-500" />, bg: 'bg-indigo-500/10 border-indigo-500/20' }
  ];

  // SVG Chart configuration
  const chartPoints = "10,90 40,75 70,80 100,50 130,45 160,35 190,20 220,10 250,5";
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard do SuperAdmin</h1>
        <p className="text-xs text-slate-500">Acompanhe métricas gerais, publicações e acessos</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.name} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">{s.name}</span>
              <span className="text-2xl font-extrabold text-slate-950 dark:text-white block">{s.count}</span>
            </div>
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${s.bg}`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive visits chart and general list layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Visits Chart Widget */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tráfego do Site (Simulado)</span>
              <span className="text-lg font-bold text-slate-950 dark:text-white block flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-brand-blue" />
                <span>45.289 visualizações este mês</span>
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">+18.4%</span>
          </div>

          {/* SVG Custom Line Graph */}
          <div className="h-48 w-full relative pt-4">
            <svg viewBox="0 0 260 100" className="w-full h-full stroke-brand-blue stroke-2 fill-none overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="260" y2="20" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="50" x2="260" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="80" x2="260" y2="80" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
              
              {/* Area under curve */}
              <path d="M10,100 L10,90 L40,75 L70,80 L100,50 L130,45 L160,35 L190,20 L220,10 L250,5 L250,100 Z" className="fill-brand-blue/5 stroke-none" />
              
              {/* Sparkline Curve */}
              <polyline points={chartPoints} />
              
              {/* Hot points */}
              <circle cx="250" cy="5" r="2.5" className="fill-white stroke-brand-blue stroke-2" />
            </svg>

            {/* Labels */}
            <div className="flex justify-between text-[9px] text-slate-500 pt-2 font-bold px-1">
              {months.map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>

        {/* Latest Activity Logs / Contents list */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Últimos Conteúdos</h3>
          
          <div className="space-y-3.5 text-xs font-medium">
            {articles.slice(0, 3).map(art => (
              <div key={art.id} className="flex justify-between items-center gap-4">
                <div className="truncate">
                  <span className="text-[10px] text-slate-500 block">Artigo • {new Date(art.published_at).toLocaleDateString('pt-BR')}</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold block truncate">{art.title}</span>
                </div>
                <Link href={`/artigos/${art.slug}`} className="text-slate-400 hover:text-brand-blue"><ChevronRight className="h-4 w-4" /></Link>
              </div>
            ))}

            {products.slice(0, 2).map(prod => (
              <div key={prod.id} className="flex justify-between items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="truncate">
                  <span className="text-[10px] text-slate-500 block">Produto • R$ {prod.price.toLocaleString('pt-BR')}</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold block truncate">{prod.name}</span>
                </div>
                <Link href={`/produtos/${prod.slug}`} className="text-slate-400 hover:text-brand-blue"><ChevronRight className="h-4 w-4" /></Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
