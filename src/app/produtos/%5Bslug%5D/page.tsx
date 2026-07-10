import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { dbService } from '@/lib/db';
import { ChevronRight, ShieldCheck, ShoppingCart, Tag, Sparkles, ArrowRight, Table, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name} - Preço, Ficha Técnica e Onde Comprar | InfoRadar`,
    description: `Confira especificações, fotos e os melhores preços para o ${product.name}. Compare ofertas em lojas como Amazon, KaBuM e Mercado Livre.`,
    alternates: {
      canonical: `/produtos/${slug}`
    }
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  // Load specs, review and category
  const specs = await dbService.getSpecsForProduct(product.id);
  const review = await dbService.getReviewByProductId(product.id);
  const categories = await dbService.getCategories();
  const brands = await dbService.getBrands();

  const category = categories.find(c => c.id === product.category_id);
  const brand = brands.find(b => b.id === product.brand_id);

  // Load related items (articles and comparisons)
  const allArticles = await dbService.getArticles();
  const relatedArticles = allArticles.filter(a => a.category_id === product.category_id).slice(0, 2);

  const allComparisons = await dbService.getComparisons();
  const relatedComparisons = allComparisons.filter(c => c.product_a_id === product.id || c.product_b_id === product.id).slice(0, 2);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link href="/search?tab=produtos" className="hover:text-brand-blue">Produtos</Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <Link href={`/search?category=${category.slug}`} className="hover:text-brand-blue">{category.name}</Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-slate-400 truncate">{product.name}</span>
      </nav>

      {/* Main product card showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Image showcase */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 flex items-center justify-center aspect-square overflow-hidden relative shadow-md">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="object-contain max-h-[380px] w-full hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right Col: Price, Title, Buy Links */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {brand && (
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded">
                  {brand.name}
                </span>
              )}
              {category && (
                <span className="text-xs font-bold bg-brand-blue/10 text-brand-blue px-2.5 py-1 rounded border border-brand-blue/20">
                  {category.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400">Modelo Oficial • Código Ref: {product.slug.toUpperCase()}</p>
          </div>

          <div className="py-4 border-y border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 block font-medium">Melhor preço encontrado</span>
            <span className="text-2xl md:text-3xl font-extrabold text-brand-blue">
              R$ {product.price.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] text-slate-500 block">Os preços podem variar conforme as ofertas diárias de afiliados.</span>
          </div>

          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {product.description}
          </p>

          {/* Onde comprar (Affiliate buttons) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4 text-brand-blue" />
              <span>Onde Comprar (Ofertas Afiliadas)</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Amazon */}
              {product.affiliate_amazon && (
                <a
                  href={product.affiliate_amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#ff9900]/10 border border-[#ff9900]/30 hover:bg-[#ff9900]/25 text-[#ff9900] text-xs font-bold tracking-tight hover:scale-[1.01] transition-all cursor-pointer group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">Amazon Brasil <ExternalLink className="h-3.5 w-3.5" /></span>
                  <span>Ir para loja →</span>
                </a>
              )}

              {/* KaBuM */}
              {product.affiliate_kabum && (
                <a
                  href={product.affiliate_kabum}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#0060b1]/10 border border-[#0060b1]/30 hover:bg-[#0060b1]/25 text-[#0060b1] text-xs font-bold tracking-tight hover:scale-[1.01] transition-all cursor-pointer group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">KaBuM! <ExternalLink className="h-3.5 w-3.5" /></span>
                  <span>Ir para loja →</span>
                </a>
              )}

              {/* Mercado Livre */}
              {product.affiliate_mercadolivre && (
                <a
                  href={product.affiliate_mercadolivre}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#fff159]/10 border border-[#fff159]/30 hover:bg-[#fff159]/25 text-yellow-600 dark:text-yellow-400 text-xs font-bold tracking-tight hover:scale-[1.01] transition-all cursor-pointer group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">Mercado Livre <ExternalLink className="h-3.5 w-3.5" /></span>
                  <span>Ir para loja →</span>
                </a>
              )}

              {/* Magazine Luiza */}
              {product.affiliate_magalu && (
                <a
                  href={product.affiliate_magalu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#0086ff]/10 border border-[#0086ff]/30 hover:bg-[#0086ff]/25 text-[#0086ff] text-xs font-bold tracking-tight hover:scale-[1.01] transition-all cursor-pointer group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">Magalu <ExternalLink className="h-3.5 w-3.5" /></span>
                  <span>Ir para loja →</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Specs and related reviews links */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Specs Table */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Table className="h-4 w-4 text-brand-blue" />
            <span>Ficha Técnica Completa</span>
          </h3>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-brand-dark-card shadow-sm text-xs md:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  <th className="p-4">Característica</th>
                  <th className="p-4">Especificação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {specs.length > 0 ? (
                  specs.map(spec => (
                    <tr key={spec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-4 text-slate-500 dark:text-slate-400">{spec.spec_name}</td>
                      <td className="p-4 text-slate-800 dark:text-slate-200">{spec.spec_value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-slate-500">Nenhuma ficha técnica cadastrada para este produto.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews and Related Comparisons */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Review prompt */}
          {review ? (
            <div className="p-5 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-brand-blue/15 blur-2xl" />
              <div className="space-y-1.5 relative z-10">
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">Review InfoRadar</span>
                <h4 className="text-sm font-bold text-slate-950 dark:text-white leading-tight">
                  Temos um review completo com testes deste produto
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Veja a nota geral ({review.rating}/10), prós, contras e veredito técnico.
                </p>
              </div>
              <Link
                href={`/reviews/${product.slug}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold px-4 py-2 transition-all cursor-pointer relative z-10"
              >
                <span>Ler Review Técnico →</span>
              </Link>
            </div>
          ) : (
            <div className="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2 text-slate-500 text-xs">
              <ShieldCheck className="h-6 w-6 text-slate-400 mx-auto" />
              <p className="font-bold">Sem Review Técnico ainda</p>
              <p className="text-slate-400 leading-snug">Nossos especialistas estão testando este produto. Cadastre-se na newsletter para ser notificado.</p>
            </div>
          )}

          {/* Comparisons */}
          {relatedComparisons.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comparativos Relacionados</h4>
              <div className="space-y-2">
                {relatedComparisons.map(comp => (
                  <Link
                    key={comp.id}
                    href={`/comparativos/${comp.slug}`}
                    className="flex justify-between items-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card hover:border-brand-blue text-xs font-semibold transition-colors"
                  >
                    <span className="truncate pr-4 text-slate-800 dark:text-slate-200">{comp.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-brand-blue shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {relatedArticles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guias de Compra Relacionados</h4>
              <div className="space-y-2">
                {relatedArticles.map(art => (
                  <Link
                    key={art.id}
                    href={`/artigos/${art.slug}`}
                    className="flex justify-between items-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card hover:border-brand-blue text-xs font-semibold transition-colors"
                  >
                    <span className="truncate pr-4 text-slate-800 dark:text-slate-200">{art.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-brand-blue shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
