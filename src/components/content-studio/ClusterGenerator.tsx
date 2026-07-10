'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, CheckSquare, Square, Check, RefreshCw } from 'lucide-react';

interface ClusterGeneratorProps {
  productName: string;
  onGenerateSelected: (selectedTitles: string[]) => void;
  generating: boolean;
}

export default function ClusterGenerator({
  productName,
  onGenerateSelected,
  generating
}: ClusterGeneratorProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const name = productName || 'Dispositivo';

  // Automatically suggest relevant cluster headlines
  const suggestions = [
    `Review Completo: Vale a pena comprar o ${name}?`,
    `${name} vs Concorrentes: Qual entrega melhor custo-benefício?`,
    `Guia definitivo de compra: O que verificar no ${name}`,
    `FAQ de suporte técnico do ${name}`,
    `Melhor escolha da marca: Onde o ${name} se posiciona?`,
    `Legenda rápida Instagram para divulgar ofertas do ${name}`,
    `Script para YouTube Shorts comparando o ${name}`,
    `Thread no X (antigo Twitter) explicando a ficha técnica do ${name}`
  ];

  const handleToggle = (title: string) => {
    setSelected(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === suggestions.length) {
      setSelected([]);
    } else {
      setSelected(suggestions);
    }
  };

  const handleGenerate = () => {
    if (selected.length === 0) return;
    onGenerateSelected(selected);
    setSelected([]);
  };

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.02] p-5 space-y-4">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span>Cluster Generator (Sugestão de Pautas)</span>
          </h3>
          <p className="text-[11px] text-slate-400 leading-snug">
            Nossa IA analisou a ficha técnica do **{name}** e sugere estes 8 conteúdos satélites relacionados:
          </p>
        </div>

        <button
          onClick={handleSelectAll}
          className="text-[10px] font-bold text-indigo-400 hover:underline shrink-0"
        >
          {selected.length === suggestions.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
        </button>
      </div>

      {/* Grid of suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {suggestions.map((title) => {
          const isSelected = selected.includes(title);
          return (
            <button
              key={title}
              onClick={() => handleToggle(title)}
              className={`text-left p-3 rounded-lg border text-[11px] font-medium transition-all flex justify-between items-center gap-3 cursor-pointer ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="truncate">{title}</span>
              <span className="shrink-0 text-indigo-400">
                {isSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4 text-slate-600" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleGenerate}
          disabled={selected.length === 0 || generating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold px-4 py-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
        >
          {generating ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Escrevendo Rascunhos...</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Gerar {selected.length} Pautas Selecionadas</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
