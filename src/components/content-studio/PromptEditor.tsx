'use client';

import React, { useState } from 'react';
import { X, Save, ShieldAlert } from 'lucide-react';
import { Prompt } from '@/lib/seedData';

interface PromptEditorProps {
  prompt?: Prompt | null;
  onClose: () => void;
  onSave: (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => void;
}

export default function PromptEditor({
  prompt,
  onClose,
  onSave
}: PromptEditorProps) {
  const [name, setName] = useState(prompt?.name || '');
  const [category, setCategory] = useState(prompt?.category || 'review');
  const [provider, setProvider] = useState(prompt?.provider || 'gemini');
  const [model, setModel] = useState(prompt?.model || 'gemini-1.5-pro');
  const [version, setVersion] = useState(prompt?.version || '1.0');
  const [temperature, setTemperature] = useState(prompt?.temperature || 0.7);
  const [promptText, setPromptText] = useState(prompt?.prompt || '');
  const [active, setActive] = useState(prompt ? prompt.active : true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !promptText) return;
    onSave({
      id: prompt?.id,
      name,
      category,
      provider,
      model,
      version,
      temperature: Number(temperature),
      prompt: promptText,
      active
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card shadow-2xl p-6 space-y-4 animate-scale-in text-xs"
      >
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {prompt ? 'Editar Prompt de Sistema' : 'Novo Prompt de Sistema'}
            </h3>
            <p className="text-[10px] text-slate-500">Configure as diretrizes gerais que a IA seguirá.</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Roles notice info */}
        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
          <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
          <p className="text-[10px] leading-relaxed">
            **Restrito:** Apenas usuários **SuperAdmin** possuem privilégios para criar ou alterar prompts de sistema.
          </p>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Nome do Prompt</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none focus:border-brand-blue"
              placeholder="Ex: Review Completo V1"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400">Categoria (Tipo)</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none focus:border-brand-blue"
            >
              <option value="review">Review Completo</option>
              <option value="guia">Guia de Compra</option>
              <option value="faq">FAQ</option>
              <option value="seo">SEO Metadados</option>
              <option value="linkedin">LinkedIn Post</option>
              <option value="instagram">Instagram</option>
              <option value="shorts">YouTube Shorts</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400">Provider Padrão</label>
            <select
              value={provider}
              onChange={e => setProvider(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none focus:border-brand-blue"
            >
              <option value="gemini">Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
              <option value="deepseek">DeepSeek</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400">Modelo Recomendado</label>
            <input 
              type="text" 
              required
              value={model}
              onChange={e => setModel(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none focus:border-brand-blue"
              placeholder="Ex: gemini-1.5-pro"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400">Temperatura ({temperature})</label>
            <input 
              type="range" 
              min="0"
              max="1.5"
              step="0.1"
              value={temperature}
              onChange={e => setTemperature(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-blue my-3"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400">Versão</label>
            <input 
              type="text" 
              required
              value={version}
              onChange={e => setVersion(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none"
              placeholder="1.0"
            />
          </div>
        </div>

        {/* Prompt template textarea */}
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="font-bold text-slate-400">Instruções do Prompt (Template)</label>
            <span className="text-[10px] text-slate-500">Variáveis suportadas: {"{product_name}"}, {"{product_description}"}</span>
          </div>
          <textarea
            required
            rows={5}
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 text-white outline-none focus:border-brand-blue font-mono text-[11px]"
            placeholder="Escreva as diretrizes gerais..."
          />
        </div>

        {/* Toggle active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active-toggle"
            checked={active}
            onChange={e => setActive(e.target.checked)}
            className="rounded border-slate-800 bg-slate-900 text-brand-blue focus:ring-brand-blue h-4 w-4"
          />
          <label htmlFor="active-toggle" className="font-bold text-slate-300 cursor-pointer select-none">
            Marcar este prompt como Ativo no Content Studio
          </label>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 font-bold text-slate-400 hover:bg-slate-900"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white font-bold px-5 py-2 cursor-pointer transition-all"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Salvar Alterações</span>
          </button>
        </div>

      </form>
    </div>
  );
}
