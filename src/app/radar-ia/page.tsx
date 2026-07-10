import React from 'react';
import RadarIA from '@/components/RadarIA';
import { Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Radar IA - Recomendador Inteligente de Tecnologia | InfoRadar',
  description: 'Descubra os melhores computadores, smartphones, SSDs e eletrônicos baseados nas suas necessidades exatas de uso e orçamento.',
};

export default function RadarIAPage() {
  return (
    <div className="flex-1 py-12 md:py-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/5 via-brand-dark/0 to-brand-dark/0">
      <div className="mx-auto max-w-4xl px-4 text-center space-y-6 mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3.5 py-1 text-xs font-bold text-brand-blue border border-brand-blue/20">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Filtro de Decisão Inteligente</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Radar <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">IA</span>
        </h1>
        
        <p className="mx-auto max-w-xl text-xs md:text-sm text-slate-400">
          Nosso assistente irá cruzar todas as especificações técnicas, testes reais e preços atuais de nosso catálogo de produtos para encontrar o dispositivo perfeito para seu caso.
        </p>
      </div>

      <RadarIA />
    </div>
  );
}
