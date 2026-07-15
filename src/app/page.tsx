import React from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/db';
import {
  Laptop, Smartphone, Monitor, HardDrive, Cpu, MousePointer,
  Keyboard, Home, Headphones, Sparkles, ArrowRight, Star,
  ChevronRight, Flame, BookOpen, Clock, TrendingUp
} from 'lucide-react';

export default async function HomePage() {
  const categories  = await dbService.getCategories();
  const products    = await dbService.getProducts();
  const reviews     = await dbService.getReviews();
  const comparisons = await dbService.getComparisons();
  const articles    = await dbService.getArticles();

  const featuredReviews = reviews.slice(0, 3).map(rev => {
    const prod = products.find(p => p.id === rev.product_id);
    return { review: rev, product: prod };
  }).filter(i => i.product);

  const getCategoryIcon = (name: string) => {
    const cls = 'h-4 w-4';
    const map: Record<string, React.ReactNode> = {
      Laptop: <Laptop className={cls} />, Smartphone: <Smartphone className={cls} />,
      Monitor: <Monitor className={cls} />, HardDrive: <HardDrive className={cls} />,
      Cpu: <Cpu className={cls} />, MousePointer: <MousePointer className={cls} />,
      Keyboard: <Keyboard className={cls} />, Home: <Home className={cls} />,
      Headphones: <Headphones className={cls} />,
    };
    return map[name] ?? <Sparkles className={cls} />;
  };

  const hero = featuredReviews[0];
  const secondary = featuredReviews.slice(1, 3);

  return (
    <div className="flex-1">

      {/* ── TOP BAR: Radar IA strip ──────────────────────────────────── */}
      <div className="border-b border-slate-800 bg-brand-blue/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <Link href="/radar-ia" className="flex items-center gap-2 text-xs font-semibold text-brand-blue hover:text-blue-400 transition-colors">
            <Sparkles className="h-3 w-3 animate-pulse shrink-0" />
            <span>Novo: Radar IA recomenda o produto certo para o seu perfil em menos de 2 minutos →</span>
          </Link>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {reviews.length} reviews</span>
            <span>·</span>
            <span>{comparisons.length} comparativos</span>
          </div>
        </div>
      </div>

      {/* ── EDITORIAL HERO: Featured story + sidebar ────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-400">
            <Flame className="h-3.5 w-3.5" />
            Em destaque
          </span>
          <div className="flex-1 h-px bg-slate-800" />
          <Link href="/search?tab=reviews" className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
            Ver todos os reviews <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Editorial grid: 1 hero + 2 secondary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Hero card */}
          {hero?.product && (
            <Link
              href={`/reviews/${hero.product.slug}`}
              className="lg:col-span-8 group block relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={hero.product.image_url}
                  alt={hero.product.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Content over image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/15 border border-brand-blue/30 px-2 py-0.5 rounded">
                      Review Completo
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" />
                      {hero.review.rating.toFixed(1)}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2 group-hover:text-blue-200 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {hero.product.name}
                  </h2>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed max-w-xl">
                    {hero.review.summary}
                  </p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                    <span className="font-bold text-white text-sm">R$ {hero.product.price.toLocaleString('pt-BR')}</span>
                    <span>·</span>
                    <span className="text-brand-blue font-semibold group-hover:underline">Ler review completo →</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Secondary stack */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {secondary.map(({ review, product }) =>
              product && (
                <Link
                  key={review.id}
                  href={`/reviews/${product.slug}`}
                  className="group flex gap-4 items-start rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 hover:bg-slate-900 transition-all duration-200"
                >
                  <div className="relative h-20 w-24 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Review</span>
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400">
                        <Star className="h-2.5 w-2.5 fill-amber-400" />{review.rating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">
                      R$ {product.price.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </Link>
              )
            )}

            {/* Radar IA compact CTA */}
            <Link
              href="/radar-ia"
              className="group flex items-center gap-4 rounded-xl border border-brand-blue/25 bg-brand-blue/8 p-4 hover:border-brand-blue/40 hover:bg-brand-blue/12 transition-all duration-200"
            >
              <div className="h-10 w-10 shrink-0 rounded-lg bg-brand-blue/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-brand-blue" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white leading-tight">Radar IA</p>
                <p className="text-xs text-slate-400 mt-0.5">Encontre o produto certo para você em 2 min</p>
              </div>
              <ArrowRight className="h-4 w-4 text-brand-blue shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────────── */}
      <section className="border-y border-slate-800/60 bg-slate-900/30 py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 shrink-0 pr-4 border-r border-slate-800 mr-2">
              Categorias
            </span>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.slug}`}
                className="flex items-center gap-2 shrink-0 px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-brand-blue/40 hover:bg-slate-800/60 hover:text-brand-blue text-slate-400 transition-all duration-150 text-xs font-medium"
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISONS + ARTICLES: Two-column editorial ────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Comparativos */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400">Comparativos</span>
              <div className="flex-1 h-px bg-slate-800" />
              <Link href="/comparativos" className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
                Ver todos <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {comparisons.map((comp, i) => {
                const prodA = products.find(p => p.id === comp.product_a_id);
                const prodB = products.find(p => p.id === comp.product_b_id);
                return prodA && prodB && (
                  <Link
                    key={comp.id}
                    href={`/comparativos/${comp.slug}`}
                    className="group flex gap-5 items-center border border-slate-800 rounded-xl bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 p-4 transition-all duration-200"
                  >
                    {/* VS visual */}
                    <div className="shrink-0 flex items-center gap-2 text-xs font-bold">
                      <div className="text-center w-16">
                        <div className="h-10 w-16 rounded bg-slate-800 mb-1 overflow-hidden">
                          <img src={prodA.image_url} alt={prodA.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[9px] text-slate-500 block truncate">{prodA.name.split(' ').slice(0,2).join(' ')}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-600">VS</span>
                      <div className="text-center w-16">
                        <div className="h-10 w-16 rounded bg-slate-800 mb-1 overflow-hidden">
                          <img src={prodB.image_url} alt={prodB.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[9px] text-slate-500 block truncate">{prodB.name.split(' ').slice(0,2).join(' ')}</span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-200 group-hover:text-white leading-snug line-clamp-1 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {comp.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{comp.description}</p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-600 shrink-0 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Artigos */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-400">Guias & Artigos</span>
              <div className="flex-1 h-px bg-slate-800" />
              <Link href="/search?tab=artigos" className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
                Ver todos <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-0 divide-y divide-slate-800/60">
              {articles.slice(0, 4).map((art, i) => (
                <Link
                  key={art.id}
                  href={`/artigos/${art.slug}`}
                  className="group flex gap-4 items-start py-4 first:pt-0 hover:bg-slate-900/30 -mx-3 px-3 rounded-lg transition-colors duration-150"
                >
                  <div className="shrink-0 text-lg font-black text-slate-800 w-5 mt-0.5 select-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                    <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-300 group-hover:text-white line-clamp-2 leading-snug transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {art.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-600">
                      <span>{art.author_name}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{art.read_time} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RADAR IA: editorial inset banner ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="border border-slate-700/50 rounded-xl bg-slate-900/60 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-brand-blue" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Sem tempo para ler todas as reviews? Use o Radar IA.
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Responda 7 perguntas e receba uma recomendação personalizada com base no seu perfil de uso e orçamento.
            </p>
          </div>
          <Link
            href="/radar-ia"
            className="shrink-0 inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150"
          >
            Iniciar agora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
