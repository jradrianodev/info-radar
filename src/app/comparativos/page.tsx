import React from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/db';
import { ChevronRight, GitCompare, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comparativos de Tecnologia | InfoRadar',
  description: 'Compare especificações, prós, contras e veja o veredito de notebooks, smartphones, SSDs e monitores.',
};

export default async function ComparisonsIndexPage() {
  const comparisons = await dbService.getComparisons();
  const products = await dbService.getProducts();

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 rounded uppercase tracking-wider inline-block">
          Comparativos Técnicos
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Notebook A vs Notebook B
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cruzamos as fichas técnicas detalhadas e compilamos os prós/contras para ajudar você a decidir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comparisons.length > 0 ? (
          comparisons.map((comp) => {
            const prodA = products.find(p => p.id === comp.product_a_id);
            const prodB = products.find(p => p.id === comp.product_b_id);
            
            return (
              prodA && prodB && (
                <div 
                  key={comp.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <GitCompare className="h-4.5 w-4.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Lado a Lado</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {comp.description}
                    </p>

                    {/* VS graphics */}
                    <div className="grid grid-cols-5 items-center gap-2 py-4 border-y border-slate-100 dark:border-slate-800">
                      <div className="col-span-2 text-center space-y-1">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{prodA.name}</span>
                        <span className="text-[10px] text-slate-400">R$ {prodA.price.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="col-span-1 text-center font-bold text-indigo-400 text-sm">VS</div>
                      <div className="col-span-2 text-center space-y-1">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{prodB.name}</span>
                        <span className="text-[10px] text-slate-400">R$ {prodB.price.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-2 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Veredito por especialistas</span>
                    <Link 
                      href={`/comparativos/${comp.slug}`}
                      className="inline-flex items-center gap-1.5 text-brand-blue font-bold hover:translate-x-0.5 transition-transform"
                    >
                      <span>Ver Comparativo</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )
            );
          })
        ) : (
          <div className="col-span-2 text-center py-16 text-slate-500">
            Nenhum comparativo cadastrado no momento.
          </div>
        )}
      </div>

    </div>
  );
}
