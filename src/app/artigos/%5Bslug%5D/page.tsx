import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { dbService } from '@/lib/db';
import { ChevronRight, Calendar, Clock, User, Share2, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { Metadata } from 'next';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await dbService.getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | InfoRadar`,
    description: article.summary,
    alternates: {
      canonical: `/artigos/${slug}`
    }
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await dbService.getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const categories = await dbService.getCategories();
  const category = categories.find(c => c.id === article.category_id);

  const allArticles = await dbService.getArticles();
  const relatedArticles = allArticles.filter(a => a.id !== article.id && a.category_id === article.category_id).slice(0, 2);

  // Parse markdown content lines to custom paragraph nodes
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('### ')) {
        return <h3 key={index} className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={index} className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('* ')) {
        return (
          <ul key={index} className="list-disc pl-5 my-4 space-y-2 text-xs md:text-sm text-slate-400">
            {trimmed.split('\n').map((li, i) => (
              <li key={i}>{li.replace('* ', '')}</li>
            ))}
          </ul>
        );
      }
      return <p key={index} className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed my-4 font-medium">{trimmed}</p>;
    });
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link href="/search?tab=artigos" className="hover:text-brand-blue">Artigos</Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <Link href={`/search?category=${category.slug}`} className="hover:text-brand-blue">{category.name}</Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-slate-400 truncate">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="flex items-center gap-2">
          {category && (
            <span className="text-xs font-bold bg-brand-blue/10 text-brand-blue px-2.5 py-1 rounded border border-brand-blue/20">
              {category.name}
            </span>
          )}
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{article.read_time} min de leitura</span>
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {article.title}
        </h1>

        <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic border-l-2 border-brand-blue pl-4">
          {article.summary}
        </p>

        {/* Author details */}
        <div className="flex items-center justify-between border-y border-slate-200 dark:border-slate-800 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <img src={article.author_avatar} alt={article.author_name} className="object-cover h-full w-full" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-950 dark:text-white block">{article.author_name}</span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                <Calendar className="h-3 w-3" />
                <span>Publicado em {new Date(article.published_at).toLocaleDateString('pt-BR')}</span>
              </span>
            </div>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Cover Image */}
      {article.image_url && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden aspect-video bg-slate-900 shadow-md">
          <img src={article.image_url} alt={article.title} className="object-cover h-full w-full" />
        </section>
      )}

      {/* Rich Text Markdown body */}
      <article className="prose prose-invert max-w-none">
        {renderContent(article.content)}
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leia a seguir</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map(art => (
              <Link 
                key={art.id}
                href={`/artigos/${art.slug}`}
                className="group flex flex-col justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card hover:border-brand-blue transition-all"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{art.read_time} min leitura</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors line-clamp-2">{art.title}</h4>
                </div>
                <span className="text-[11px] text-brand-blue font-bold mt-4 block">Ler artigo →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Prepared Comments block (initially disabled) */}
      <section className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-brand-blue" />
          <span>Comentários</span>
        </h3>

        {/* Disabled Banner */}
        <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-4 text-xs text-amber-500 flex gap-2">
          <Share2 className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Espaço de Comentários Desabilitado</span>
            <span className="text-slate-400">Esta funcionalidade está em manutenção para moderação automática antispam. Retornaremos em breve!</span>
          </div>
        </div>

        {/* Structure layout placeholder */}
        <div className="opacity-40 pointer-events-none space-y-4">
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 shrink-0" />
            <div className="flex-1 space-y-2">
              <input 
                type="text" 
                placeholder="Adicione um comentário público..." 
                className="w-full text-xs rounded-lg border border-slate-800 bg-slate-900/50 p-2.5 text-white placeholder-slate-400 focus:outline-none" 
              />
              <div className="flex justify-end">
                <button className="flex items-center gap-1 bg-brand-blue text-white font-bold text-xs px-3 py-1.5 rounded-lg"><Send className="h-3 w-3" /> Enviar</button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex gap-3 text-xs">
              <div className="h-8 w-8 rounded-full bg-slate-800 shrink-0" />
              <div className="space-y-1">
                <span className="font-bold text-white block">Marcos Silva <span className="text-[10px] text-slate-500 font-normal">há 2 dias</span></span>
                <p className="text-slate-400">Excelente comparativo! O MacBook Air M3 realmente faz diferença pelo consumo. Mas o preço do XPS 13 OLED é competitivo se comprado fora.</p>
                <button className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold"><ThumbsUp className="h-3 w-3" /> 12</button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
