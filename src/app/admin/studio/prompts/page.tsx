'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Power, 
  Layers, 
  Cpu, 
  FileText,
  Loader2
} from 'lucide-react';
import { usePromptManager } from '@/hooks/usePromptManager';
import PromptEditor from '@/components/content-studio/PromptEditor';
import { Prompt } from '@/lib/seedData';

export default function PromptsCRUD() {
  const { prompts, loading, createPrompt, updatePrompt, deletePrompt } = usePromptManager();
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);

  const filteredPrompts = prompts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.provider.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Omit<Prompt, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
    try {
      if (data.id) {
        await updatePrompt(data.id, data);
        alert('Prompt atualizado com sucesso!');
      } else {
        await createPrompt(data);
        alert('Novo prompt criado com sucesso!');
      }
      setEditorOpen(false);
      setActivePrompt(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este prompt?')) {
      const ok = await deletePrompt(id);
      if (ok) alert('Prompt excluído com sucesso!');
    }
  };

  const toggleStatus = async (id: string, currentActive: boolean) => {
    await updatePrompt(id, { active: !currentActive });
  };

  return (
    <div className="flex-1 space-y-6 text-xs text-slate-300">
      
      {/* Navigation sub header */}
      <div className="flex justify-between items-center bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white">Prompt Manager</h1>
            <p className="text-[10px] text-slate-400">Configure os templates de prompt de sistema e parâmetros de geração</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/admin/studio" 
            className="px-3.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white font-bold transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/studio/prompts" 
            className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20"
          >
            Prompt Manager
          </Link>
          <Link 
            href="/admin/studio/settings" 
            className="px-3.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white font-bold transition-colors"
          >
            Configuração IA
          </Link>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex justify-between items-center gap-4 bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Pesquisar prompts por nome, categoria ou provider..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-brand-blue"
          />
        </div>

        {/* Create new */}
        <button
          onClick={() => {
            setActivePrompt(null);
            setEditorOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white font-bold px-4 py-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Prompt</span>
        </button>

      </div>

      {/* Prompts list grid */}
      {loading ? (
        <div className="py-24 text-center space-y-2">
          <Loader2 className="h-8 w-8 text-brand-blue animate-spin mx-auto" />
          <span>Buscando prompts...</span>
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="py-16 text-center text-slate-500 border border-slate-800 rounded-xl">
          Nenhum prompt de sistema cadastrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrompts.map((p) => (
            <div 
              key={p.id}
              className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 bg-white dark:bg-brand-dark-card transition-all ${
                p.active 
                  ? 'border-slate-200 dark:border-slate-800' 
                  : 'border-slate-800 opacity-60'
              }`}
            >
              
              {/* Category, active toggle status */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      v{p.version}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">{p.name}</h4>
                </div>

                <button
                  onClick={() => toggleStatus(p.id, p.active)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    p.active 
                      ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' 
                      : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                  title={p.active ? 'Desativar Prompt' : 'Ativar Prompt'}
                >
                  <Power className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Prompt raw code */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-400 line-clamp-3">
                {p.prompt}
              </div>

              {/* Specs & Actions footer */}
              <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] text-slate-500">
                <div className="flex items-center gap-3 font-semibold">
                  <span className="flex items-center gap-1"><Cpu className="h-3.5 w-3.5 text-indigo-400" /> {p.provider} ({p.model})</span>
                  <span>Temp: {p.temperature}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActivePrompt(p);
                      setEditorOpen(true);
                    }}
                    className="p-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 border border-slate-200 dark:border-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Editor Modal dialog popup */}
      {editorOpen && (
        <PromptEditor 
          prompt={activePrompt}
          onClose={() => {
            setEditorOpen(false);
            setActivePrompt(null);
          }}
          onSave={handleSave}
        />
      )}

    </div>
  );
}
