import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { dbService } from '@/lib/db';
import { ChevronRight, Star, ThumbsUp, ThumbsDown, Check, X, Bookmark, Share2, ShoppingCart } from 'lucide-react';
import { Metadata } from 'next';

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const review = await dbService.getReviewBySlug(slug);
  const product = await dbService.getProductBySlug(slug);
  if (!review || !product) return {};

  return {
    title: `Review Completo: ${product.name} - Vale a Pena? | InfoRadar`,
    description: `${review.summary.substring(0, 150)}... Veja a nota, prós, contras e veredito técnico.`,
    alternates: {
      canonical: `/reviews/${slug}`
    }
  };
}

export default async function ReviewDetailPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const review = await dbService.getReviewBySlug(slug);
  const product = await dbService.getProductBySlug(slug);

  if (!review || !product) {
    notFound();
  }

  const categories = await dbService.getCategories();
  const category = categories.find(c => c.id === product.category_id);

  // Helper for score colors
  const getRatingColor = (rating: number) => {
    if (rating >= 9.0) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (rating >= 7.5) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (rating >= 6.0) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link href="/search?tab=reviews" className="hover:text-brand-blue">Reviews</Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <Link href={`/search?category=${category.slug}`} className="hover:text-brand-blue">{category.name}</Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-slate-400 truncate">{product.name}</span>
      </nav>

      {/* Main Review Header */}
      <header className="space-y-4">
        <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 rounded uppercase tracking-wider inline-block">
          Review Técnico Independente
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Análise Completa: {product.name}
        </h1>
        <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed">
          Colocamos o modelo oficial à prova: desempenho sob estresse, qualidade de tela, eficiência energética e veredito final.
        </p>
      </header>

      {/* Hero Score Block */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 md:p-8 shadow-lg relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-brand-blue/5 blur-3xl" />
        
        <div className="md:col-span-3 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nota Geral</span>
          
          {/* Big Score Indicator */}
          <div className={`h-24 w-24 rounded-full border-2 flex flex-col items-center justify-center font-extrabold shadow-sm ${getRatingColor(review.rating)}`}>
            <span className="text-3xl">{review.rating.toFixed(1)}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">de 10</span>
          </div>

          <span className="text-xs text-slate-500 font-semibold mt-2">Excelente escolha</span>
        </div>

        <div className="md:col-span-9 flex flex-col justify-between p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-300">Resumo da Análise</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {review.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link 
              href={`/produtos/${product.slug}`} 
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold px-4 py-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Ver Onde Comprar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pros & Cons Columns */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pros */}
        <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-6 space-y-4">
          <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            <span>Prós</span>
          </h3>
          <ul className="space-y-2.5">
            {review.pros.map((pro, index) => (
              <li key={index} className="flex gap-2 text-xs text-slate-800 dark:text-slate-300 font-medium">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="rounded-xl border border-red-500/10 bg-red-500/[0.02] p-6 space-y-4">
          <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
            <ThumbsDown className="h-4 w-4" />
            <span>Contras</span>
          </h3>
          <ul className="space-y-2.5">
            {review.contras.map((contra, index) => (
              <li key={index} className="flex gap-2 text-xs text-slate-800 dark:text-slate-300 font-medium">
                <X className="h-4 w-4 text-red-500 shrink-0" />
                <span>{contra}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery & specs table grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Product Gallery Carousel representation */}
        <div className="md:col-span-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Galeria de Fotos</h3>
          <div className="grid grid-cols-2 gap-3">
            {review.gallery.map((url, i) => (
              <div key={i} className="aspect-video bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <img src={url} alt={`Photo ${i+1}`} className="object-cover h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Specific review features table */}
        <div className="md:col-span-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Características Testadas</h3>
          
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card overflow-hidden shadow-sm text-xs">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {Object.entries(review.specs_table).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center p-3.5">
                  <span className="font-semibold text-slate-400">{key}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Veredito Final (Conclusion) */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Veredito & Conclusão
        </h3>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {review.conclusion}
        </p>
      </section>

      {/* Affiliation direct buy options */}
      <section className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Pronto para comprar o {product.name}?</h3>
        <p className="text-xs text-slate-500">Compare os melhores preços em lojas verificadas:</p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href={`/produtos/${product.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold px-6 py-3 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Ver Ficha Técnica e Preços →</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
