'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Cpu, Clock, DollarSign, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useGenerateContent } from '@/hooks/useGenerateContent';
import { useAISettings } from '@/hooks/useAISettings';

interface GenerateContentDialogProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GenerateContentDialog({
  productId,
  productName,
  onClose,
  onSuccess
}: GenerateContentDialogProps) {
  const { generate, generating, progress, error } = useGenerateContent();
  const { settings, loading: settingsLoading } = useAISettings();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['review', 'seo']);

  const options = [
    { id: 'review', name: 'Review Completo' },
    { id: 'guia', name: 'Guia de Compra' },
    { id: 'faq', name: 'FAQ de Dúvidas' },
    { id: 'seo', name: 'Metadados SEO' },
    { id: 'linkedin', name: 'Post LinkedIn' },
    { id: 'instagram', name: 'Legenda Instagram' },
    { id: 'youtube', name: 'Roteiro YouTube' },
    { id: 'shorts', name: 'Roteiro Shorts/Reels' }
  ];

  const handleToggle = (id: string) => {
    setSelectedTypes(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedTypes.length === 0) return;
    try {
      await generate(productId, selectedTypes);
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  // Compute estimated stats
  const estimatedCost = selectedTypes.length * 0.0022;
  const estimatedTime = selectedTypes.length * 1.2; // seconds

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card shadow-2xl p-6 space-y-5 animate-scale-in text-xs">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Content Studio AI</h3>
              <p className="text-[10px] text-slate-500">Escreva múltiplos formatos de pautas de uma só vez</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={generating}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {generating ? (
          /* ACTIVE GENERATING WIDGET */
          <div className="py-10 text-center space-y-6">
            <RefreshCw className="h-10 w-10 text-brand-blue animate-spin mx-auto" />
            
            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm block">Geração em Andamento...</span>
              <p className="text-[10px] text-slate-400">Solicitando ao provider e inserindo rascunhos no banco.</p>
            </div>

            {/* Progress Slider bar */}
            <div className="max-w-xs mx-auto space-y-1">
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-blue rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
            </div>

            {/* Estimates logs */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400">
              <div className="space-y-0.5">
                <span className="block text-slate-500 uppercase tracking-widest text-[9px]">Modelo</span>
                <span className="text-white flex items-center justify-center gap-1"><Cpu className="h-3.5 w-3.5 text-brand-blue" /> {settings?.model || 'gemini-1.5-pro'}</span>
              </div>
              <div className="space-y-0.5">
                <span className="block text-slate-500 uppercase tracking-widest text-[9px]">Tempo Estimado</span>
                <span className="text-white flex items-center justify-center gap-1"><Clock className="h-3.5 w-3.5 text-brand-blue" /> {estimatedTime.toFixed(1)}s</span>
              </div>
              <div className="space-y-0.5">
                <span className="block text-slate-500 uppercase tracking-widest text-[9px]">Custo Máximo</span>
                <span className="text-emerald-400 flex items-center justify-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ${estimatedCost.toFixed(4)}</span>
              </div>
            </div>

          </div>
        ) : (
          /* CONFIG SELECTION VIEW */
          <div className="space-y-5">
            
            {/* Context Product name */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Produto de Referência</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{productName}</span>
            </div>

            {/* Options grid */}
            <div className="space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">Escolha as Pautas a Gerar</span>
              <div className="grid grid-cols-2 gap-2.5">
                {options.map(opt => {
                  const isChecked = selectedTypes.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggle(opt.id)}
                      className={`p-3 rounded-lg border text-left font-semibold transition-all flex justify-between items-center cursor-pointer ${
                        isChecked 
                          ? 'border-brand-blue bg-brand-blue/10 text-white' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{opt.name}</span>
                      {isChecked && <CheckCircle2 className="h-4 w-4 text-brand-blue shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated pricing summaries */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500">
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-slate-400">Provider</span>
                <span className="text-slate-800 dark:text-slate-200">{settings?.provider || 'gemini'} ({settings?.model})</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-slate-400">Tempo de Fila</span>
                <span className="text-slate-800 dark:text-slate-200">~{estimatedTime.toFixed(1)}s</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-slate-400">Custo Estimado</span>
                <span className="text-emerald-400">${estimatedCost.toFixed(4)} USD</span>
              </div>
            </div>

            {error && <p className="text-[11px] text-red-500 font-bold">{error}</p>}

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={selectedTypes.length === 0}
                className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white font-bold px-5 py-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Gerar {selectedTypes.length} Rascunhos</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
