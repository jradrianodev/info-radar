import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dbService } from '@/lib/db';
import { 
  Laptop, 
  Smartphone, 
  Monitor, 
  HardDrive, 
  Cpu, 
  MousePointer, 
  Keyboard, 
  Home, 
  Headphones, 
  Sparkles, 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Check, 
  ChevronRight,
  Flame
} from 'lucide-react';

export default async function HomePage() {
  // Fetch data from database/mock layer
  const categories = await dbService.getCategories();
  const products = await dbService.getProducts();
  const reviews = await dbService.getReviews();
  const comparisons = await dbService.getComparisons();
  const articles = await dbService.getArticles();

  // Find 3 featured products that have reviews
  const featuredReviews = reviews.slice(0, 3).map(rev => {
    const prod = products.find(p => p.id === rev.product_id);
    return {
      review: rev,
      product: prod
    };
  }).filter(item => item.product !== undefined);

  // Map category icons helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="h-5 w-5" />;
      case 'Smartphone': return <Smartphone className="h-5 w-5" />;
      case 'Monitor': return <Monitor className="h-5 w-5" />;
      case 'HardDrive': return <HardDrive className="h-5 w-5" />;
      case 'Cpu': return <Cpu className="h-5 w-5" />;
      case 'MousePointer': return <MousePointer className="h-5 w-5" />;
      case 'Keyboard': return <Keyboard className="h-5 w-5" />;
      case 'Home': return <Home className="h-5 w-5" />;
      case 'Headphones': return <Headphones className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex-1 space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-slate-200 dark:border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/10 via-brand-dark/0 to-brand-dark/0" />
        
        {/* Animated background shape */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-brand-blue/5 blur-3xl" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <Link
            href="/radar-ia"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3.5 py-1 text-xs font-semibold text-brand-blue border border-brand-blue/20 hover:bg-brand-blue/20 transition-colors shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Radar IA: Recomendador Inteligente está no ar →</span>
          </Link>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
            Encontre a tecnologia <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">certa</span> antes de comprar.
          </h1>
          
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium">
            Reviews imparciais, tabelas comparativas automáticas e guias de compra escritos por especialistas para você nunca mais errar na escolha.
          </p>

          {/* Quick search shortcuts */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Mais buscados:</span>
            <Link href="/search?query=macbook" className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-brand-blue transition-colors">MacBook Air M3</Link>
            <Link href="/search?query=ssd" className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-brand-blue transition-colors">Melhor SSD NVMe</Link>
            <Link href="/comparativos/iphone-15-pro-max-vs-galaxy-s24-ultra" className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-brand-blue transition-colors">iPhone vs S24 Ultra</Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Navegar por Categoria</h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Encontre análises agrupadas pelo tipo de hardware</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark hover:border-brand-blue dark:hover:border-brand-blue hover:shadow-lg hover:shadow-brand-blue/5 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-brand-blue group-hover:text-white transition-all">
                {getCategoryIcon(cat.icon)}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-blue transition-colors truncate">{cat.name}</h3>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Ver guias</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. RADAR IA PROMO BLOCK */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-brand-blue/30 bg-gradient-to-br from-brand-blue/20 via-brand-dark-card to-brand-dark-card p-8 md:p-12 shadow-2xl glow-blue-strong">
          
          {/* Light effects */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl -translate-y-12 translate-x-12" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/20 px-3 py-1 text-xs font-semibold text-brand-blue border border-brand-blue/30">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>Radar IA Recomendador</span>
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Em dúvida sobre qual notebook ou celular comprar?
              </h2>
              <p className="text-sm md:text-base text-slate-300 max-w-xl">
                Responda a 7 perguntas simples sobre orçamento, uso principal e sistema preferido, e nosso recomendador irá cruzar as especificações e classificar os melhores produtos para você.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <Link
                href="/radar-ia"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold px-6 py-3.5 shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>Iniciar Radar IA</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS & REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" />
              <span>Reviews em Destaque</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Análises profundas com testes e notas reais</p>
          </div>
          <Link href="/search?tab=reviews" className="text-xs md:text-sm font-semibold text-brand-blue flex items-center gap-1 hover:underline">
            Ver todas as análises <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredReviews.map(({ review, product }) => (
            product && (
              <div 
                key={review.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card overflow-hidden shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 transition-all hover:-translate-y-1 duration-300"
              >
                <div>
                  {/* Aspect image placeholder / image */}
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur px-2.5 py-1 text-xs font-bold text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{review.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Review Completo</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3">
                      {review.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    R$ {product.price.toLocaleString('pt-BR')}
                  </span>
                  <Link 
                    href={`/reviews/${product.slug}`}
                    className="font-semibold text-brand-blue flex items-center gap-1 hover:translate-x-0.5 transition-transform"
                  >
                    <span>Ler review</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* 5. LATEST COMPARISONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Comparativos Lado a Lado</h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Tabelas técnicas automáticas e o nosso veredito de compra</p>
          </div>
          <Link href="/comparativos" className="text-xs md:text-sm font-semibold text-brand-blue flex items-center gap-1 hover:underline">
            Ver comparativos <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparisons.map((comp) => {
            const prodA = products.find(p => p.id === comp.product_a_id);
            const prodB = products.find(p => p.id === comp.product_b_id);
            return (
              prodA && prodB && (
                <div 
                  key={comp.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Comparativo</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {comp.description}
                    </p>

                    {/* Head-to-Head representation */}
                    <div className="grid grid-cols-5 items-center gap-2 py-4 border-y border-slate-100 dark:border-slate-800">
                      <div className="col-span-2 text-center">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{prodA.name}</span>
                        <span className="text-[10px] text-slate-400">R$ {prodA.price.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="col-span-1 text-center font-bold text-indigo-400 text-sm">VS</div>
                      <div className="col-span-2 text-center">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{prodB.name}</span>
                        <span className="text-[10px] text-slate-400">R$ {prodB.price.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Quem vence? Veja o veredito</span>
                    <Link 
                      href={`/comparativos/${comp.slug}`}
                      className="inline-flex items-center gap-1 text-brand-blue font-bold hover:translate-x-0.5 transition-transform"
                    >
                      <span>Ver Veredito</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </section>

      {/* 6. LATEST ARTICLES & GUIDES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Últimos Artigos & Guias</h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Tudo o que você precisa entender antes de desembolsar dinheiro</p>
          </div>
          <Link href="/search?tab=artigos" className="text-xs md:text-sm font-semibold text-brand-blue flex items-center gap-1 hover:underline">
            Ver todos os artigos <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art) => (
            <div 
              key={art.id} 
              className="flex flex-col sm:flex-row gap-5 items-start bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300"
            >
              <div className="relative h-32 w-full sm:w-40 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                <img 
                  src={art.image_url} 
                  alt={art.title}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="space-y-2 flex-1 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                    <span>{art.author_name}</span>
                    <span>•</span>
                    <span>{art.read_time} min de leitura</span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                    <Link href={`/artigos/${art.slug}`} className="hover:text-brand-blue transition-colors">
                      {art.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {art.summary}
                  </p>
                </div>
                <Link 
                  href={`/artigos/${art.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-blue font-semibold hover:underline pt-2"
                >
                  <span>Continuar lendo</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
