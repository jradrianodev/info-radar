import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { dbService } from '@/lib/db';
import { ChevronRight, GitCompare, ThumbsUp, ThumbsDown, Check, X, ShieldAlert, ShoppingCart } from 'lucide-react';
import { Metadata } from 'next';

interface ComparisonDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ComparisonDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await dbService.getComparisonBySlug(slug);
  if (!comparison) return {};

  return {
    title: `${comparison.title} - Qual comprar? | InfoRadar`,
    description: `${comparison.description}. Veja o comparativo técnico de especificações, prós, contras e veredito.`,
    alternates: {
      canonical: `/comparativos/${slug}`
    }
  };
}

export default async function ComparisonDetailPage({ params }: ComparisonDetailPageProps) {
  const { slug } = await params;
  const comparison = await dbService.getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  const products = await dbService.getProducts();
  const productA = products.find(p => p.id === comparison.product_a_id);
  const productB = products.find(p => p.id === comparison.product_b_id);

  if (!productA || !productB) {
    notFound();
  }

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link href="/comparativos" className="hover:text-brand-blue">Comparativos</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-slate-400 truncate">{comparison.title}</span>
      </nav>

      {/* Header Comparison Duel */}
      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/15 text-brand-blue border border-brand-blue/20 shadow-sm mb-2">
          <GitCompare className="h-6 w-6" />
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {comparison.title}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {comparison.description}
        </p>
      </header>

      {/* Grid: Side-by-side head showcase */}
      <section className="grid grid-cols-1 md:grid-cols-5 items-center gap-6 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card shadow-sm">
        
        {/* Product A */}
        <div className="col-span-2 text-center space-y-3 p-4">
          <div className="h-36 bg-slate-900/40 rounded-xl flex items-center justify-center p-4">
            <img src={productA.image_url} alt={productA.name} className="object-contain max-h-full" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{productA.name}</h3>
          <span className="text-lg font-extrabold text-brand-blue block">R$ {productA.price.toLocaleString('pt-BR')}</span>
          <Link href={`/produtos/${productA.slug}`} className="inline-block text-xs font-semibold text-slate-400 hover:text-brand-blue transition-colors">Ver ficha completa →</Link>
        </div>

        {/* VS badge middle */}
        <div className="col-span-1 text-center font-extrabold text-indigo-400 text-lg md:text-2xl">VS</div>

        {/* Product B */}
        <div className="col-span-2 text-center space-y-3 p-4">
          <div className="h-36 bg-slate-900/40 rounded-xl flex items-center justify-center p-4">
            <img src={productB.image_url} alt={productB.name} className="object-contain max-h-full" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{productB.name}</h3>
          <span className="text-lg font-extrabold text-brand-blue block">R$ {productB.price.toLocaleString('pt-BR')}</span>
          <Link href={`/produtos/${productB.slug}`} className="inline-block text-xs font-semibold text-slate-400 hover:text-brand-blue transition-colors">Ver ficha completa →</Link>
        </div>

      </section>

      {/* Comparisons Specs side-by-side table */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comparativo Técnico</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card overflow-hidden shadow-sm text-xs md:text-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                <th className="p-4 w-1/3">Característica</th>
                <th className="p-4 w-1/3">{productA.name}</th>
                <th className="p-4 w-1/3">{productB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {comparison.items.map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="p-4 text-slate-400">{it.spec_name}</td>
                  <td className="p-4 text-slate-900 dark:text-slate-200">{it.value_a}</td>
                  <td className="p-4 text-slate-900 dark:text-slate-200">{it.value_b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pros & Contras compared side-by-side */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Product A block */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/20 dark:bg-brand-dark-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Prós e Contras: {productA.name}</h3>
          
          <div className="space-y-4">
            {/* Pros */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Pontos Fortes</span>
              <ul className="space-y-2 text-xs font-medium text-slate-400">
                {comparison.pros_a.map((pro, index) => (
                  <li key={index} className="flex gap-2 items-start text-slate-800 dark:text-slate-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Cons */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Pontos Fracos</span>
              <ul className="space-y-2 text-xs font-medium text-slate-400">
                {comparison.contras_a.map((contra, index) => (
                  <li key={index} className="flex gap-2 items-start text-slate-800 dark:text-slate-300">
                    <X className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product B block */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/20 dark:bg-brand-dark-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Prós e Contras: {productB.name}</h3>
          
          <div className="space-y-4">
            {/* Pros */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Pontos Fortes</span>
              <ul className="space-y-2 text-xs font-medium text-slate-400">
                {comparison.pros_b.map((pro, index) => (
                  <li key={index} className="flex gap-2 items-start text-slate-800 dark:text-slate-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Cons */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Pontos Fracos</span>
              <ul className="space-y-2 text-xs font-medium text-slate-400">
                {comparison.contras_b.map((contra, index) => (
                  <li key={index} className="flex gap-2 items-start text-slate-800 dark:text-slate-300">
                    <X className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </section>

      {/* Veredito final */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span>O Veredito Técnico de Compra</span>
        </h3>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {comparison.verdict}
        </p>
      </section>

      {/* Purchase affiliate cards */}
      <section className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Encontre o melhor preço nas lojas</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-brand-dark-card space-y-3">
            <span className="text-xs font-bold block">{productA.name}</span>
            <Link 
              href={`/produtos/${productA.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold px-4 py-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Ver Preços de {productA.name.split(' ')[0]}</span>
            </Link>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-brand-dark-card space-y-3">
            <span className="text-xs font-bold block">{productB.name}</span>
            <Link 
              href={`/produtos/${productB.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold px-4 py-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Ver Preços de {productB.name.split(' ')[0]}</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
