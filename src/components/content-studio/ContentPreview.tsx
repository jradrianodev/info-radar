'use client';

import React, { useState } from 'react';
import { X, Save, Check, Copy, Trash, Sparkles, HelpCircle, AlignLeft, Bold, Italic, List } from 'lucide-react';
import { ContentGeneration } from '@/lib/seedData';

interface ContentPreviewProps {
  generation: ContentGeneration;
  onClose: () => void;
  onDelete: (id: string) => void;
  onPublish: (id: string, text: string) => void;
  onSave: (id: string, text: string) => void;
}

export default function ContentPreview({
  generation,
  onClose,
  onDelete,
  onPublish,
  onSave
}: ContentPreviewProps) {
  const [text, setText] = useState(generation.response);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(generation.id, text);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublish(generation.id, text);
    } finally {
      setPublishing(false);
    }
  };

  const formattedType = (type: string) => {
    const types: Record<string, string> = {
      review: 'Review Completo',
      guia: 'Guia de Compra',
      faq: 'FAQ Inteligente',
      seo: 'Metadados SEO',
      linkedin: 'Post LinkedIn',
      instagram: 'Legenda Instagram',
      youtube: 'Roteiro YouTube',
      shorts: 'Roteiro Shorts'
    };
    return types[type] || type.toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4">
      <div className="w-full max-w-3xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark shadow-2xl p-6 flex flex-col h-[85vh] animate-scale-in text-xs">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase">
                {formattedType(generation.content_type)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Gerado via {generation.provider} ({generation.model})
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">Revisão de Conteúdo Gerado</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Toolbar formatting controls */}
        <div className="flex items-center gap-1.5 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-2 shrink-0">
          <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"><Bold className="h-3.5 w-3.5" /></button>
          <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"><Italic className="h-3.5 w-3.5" /></button>
          <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"><List className="h-3.5 w-3.5" /></button>
          <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"><AlignLeft className="h-3.5 w-3.5" /></button>
          
          <div className="h-4 w-px bg-slate-800 mx-1" />
          
          <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Sugestão IA salva como Rascunho
          </span>
        </div>

        {/* Text Area Rich editor body */}
        <div className="flex-1 min-h-0 py-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 p-4 text-slate-800 dark:text-slate-200 outline-none focus:border-brand-blue resize-none font-mono text-[11px] leading-relaxed"
          />
        </div>

        {/* Technical logs metrics */}
        <div className="grid grid-cols-4 gap-4 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-500 font-bold shrink-0">
          <div>
            <span className="block text-[8px] uppercase tracking-widest text-slate-400">Tokens Input/Output</span>
            <span className="text-slate-800 dark:text-slate-200">{generation.tokens_input} / {generation.tokens_output}</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase tracking-widest text-slate-400">Custo Estimado</span>
            <span className="text-emerald-400">${generation.estimated_cost?.toFixed(5)} USD</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase tracking-widest text-slate-400">Tempo Execução</span>
            <span className="text-slate-800 dark:text-slate-200">{(generation.execution_time / 1000).toFixed(2)}s</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase tracking-widest text-slate-400">Status Publicação</span>
            <span className={`capitalize ${generation.status === 'published' ? 'text-emerald-400' : 'text-amber-400'}`}>
              ● {generation.status}
            </span>
          </div>
        </div>

        {/* Actions footer */}
        <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-4 mt-3 shrink-0">
          <button
            type="button"
            onClick={() => onDelete(generation.id)}
            className="flex items-center gap-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg px-4 py-2 font-bold transition-all"
          >
            <Trash className="h-3.5 w-3.5" />
            <span>Excluir</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg px-4 py-2 font-bold transition-all"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 border border-brand-blue/30 text-brand-blue hover:bg-brand-blue/10 rounded-lg px-4 py-2 font-bold transition-all disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing || generation.status === 'published'}
              className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg px-5 py-2 font-bold transition-all disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{publishing ? 'Publicando...' : generation.status === 'published' ? 'Publicado' : 'Publicar Manual'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
