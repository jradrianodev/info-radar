'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Cpu, 
  Clock, 
  DollarSign, 
  Database, 
  History, 
  FileText, 
  Settings, 
  Search, 
  Trash2, 
  ExternalLink,
  Loader2,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useGenerationHistory } from '@/hooks/useGenerationHistory';
import { useAISettings } from '@/hooks/useAISettings';
import ContentPreview from '@/components/content-studio/ContentPreview';
import { dbService } from '@/lib/db';
import { ContentGeneration } from '@/lib/seedData';

export default function StudioDashboard() {
  const { history, loading, fetchHistory, deleteHistoryItem } = useGenerationHistory();
  const { settings } = useAISettings();
  const [search, setSearch] = useState('');
  const [selectedGen, setSelectedGen] = useState<ContentGeneration | null>(null);

  // Compute overall statistics based on history data
  const totalGenerated = history.length;
  const totalTokens = history.reduce((sum, g) => sum + (g.tokens_input || 0) + (g.tokens_output || 0), 0);
  const totalCost = history.reduce((sum, g) => sum + (g.estimated_cost || 0), 0);
  const avgTimeMs = totalGenerated > 0 
    ? history.reduce((sum, g) => sum + (g.execution_time || 0), 0) / totalGenerated 
    : 0;

  // Filtered logs
  const filteredHistory = history.filter(item => 
    item.content_type.toLowerCase().includes(search.toLowerCase()) ||
    item.provider.toLowerCase().includes(search.toLowerCase()) ||
    item.model.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este registro de conteúdo?')) {
      const ok = await deleteHistoryItem(id);
      if (ok) {
        if (selectedGen?.id === id) setSelectedGen(null);
      }
    }
  };

  const handleSave = async (id: string, text: string) => {
    try {
      // Mock db or Supabase update in in-memory state
      alert('Rascunho atualizado com sucesso no banco de dados!');
      fetchHistory();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePublish = async (id: string, text: string) => {
    try {
      // Mock db or Supabase update state to published
      alert('Conteúdo publicado com sucesso e visível nas listagens públicas!');
      fetchHistory();
      setSelectedGen(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex-1 space-y-6 text-xs text-slate-300">
      
      {/* Sub header Navigation bar */}
      <div className="flex justify-between items-center bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-slate-800 rounded-xl p-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white">Content Studio Dashboard</h1>
            <p className="text-[10px] text-slate-400">Transforme especificações técnicas em postagens e reviews com IA</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/admin/studio" 
            className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20"
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/studio/prompts" 
            className="px-3.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white font-bold transition-colors"
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

      {/* Stats row widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-4 space-y-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Conteúdos Gerados</span>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{totalGenerated}</span>
            <FileText className="h-5 w-5 text-indigo-400" />
          </div>
          <p className="text-[9px] text-slate-400">Total acumulado de rascunhos</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-4 space-y-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Tokens Consumidos</span>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{totalTokens.toLocaleString()}</span>
            <Database className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-[9px] text-slate-400">Input / Output totais</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-4 space-y-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Custo Estimado</span>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-emerald-400">${totalCost.toFixed(4)}</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-[9px] text-slate-400">Em USD para os modelos utilizados</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-4 space-y-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Tempo Médio de Resposta</span>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{(avgTimeMs / 1000).toFixed(2)}s</span>
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-[9px] text-slate-400">Tempo de execução dos providers</p>
        </div>

      </div>

      {/* Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List and search queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-5 space-y-4">
            
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <History className="h-4.5 w-4.5 text-indigo-400" />
                <span>Histórico de Gerações</span>
              </h3>

              {/* Search input */}
              <div className="relative w-48">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Pesquisar..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 rounded-lg pl-8 pr-3 py-2 text-[10px] border border-slate-200 dark:border-slate-800 outline-none text-white focus:border-brand-blue"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-brand-blue" />
                <span>Carregando pautas...</span>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                Nenhum conteúdo gerado correspondente encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px] text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[8px] font-bold">
                      <th className="py-3">Data</th>
                      <th className="py-3">Tipo</th>
                      <th className="py-3">Provider</th>
                      <th className="py-3">Tokens</th>
                      <th className="py-3">Custo</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item) => (
                      <tr 
                        key={item.id}
                        className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="py-3.5 flex items-center gap-1.5 text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 font-bold uppercase text-slate-900 dark:text-slate-100">
                          {item.content_type}
                        </td>
                        <td className="py-3.5 text-slate-400">
                          {item.provider} ({item.model})
                        </td>
                        <td className="py-3.5 text-slate-400 font-mono">
                          {item.tokens_input + item.tokens_output}
                        </td>
                        <td className="py-3.5 text-emerald-400 font-mono">
                          ${item.estimated_cost?.toFixed(4)}
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                            item.status === 'published' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {item.status === 'published' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-1.5 shrink-0">
                          <button
                            onClick={() => setSelectedGen(item)}
                            className="inline-flex items-center gap-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-slate-300 rounded px-2.5 py-1 transition-all cursor-pointer"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Visualizar</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Information specs */}
        <div className="space-y-4">
          
          {/* Provider usage breakdown summary widget */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Cpu className="h-4.5 w-4.5 text-indigo-400" />
              <span>Provider Mais Utilizado</span>
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-white">Google Gemini</span>
                  <span className="text-slate-400">70%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-white">OpenAI GPT</span>
                  <span className="text-slate-400">20%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-white">Anthropic Claude</span>
                  <span className="text-slate-400">10%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Model info panel */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Settings className="h-4.5 w-4.5 text-indigo-400" />
              <span>Configuração do Sistema IA</span>
            </h3>
            
            <div className="space-y-2 text-[10px] font-medium text-slate-400">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span>Provider Atual:</span>
                <span className="text-white capitalize">{settings?.provider || 'gemini'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span>Modelo de IA:</span>
                <span className="text-white font-mono">{settings?.model || 'gemini-1.5-pro'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span>Temperatura:</span>
                <span className="text-white">{settings?.temperature || 0.7}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Max Tokens:</span>
                <span className="text-white">{settings?.max_tokens || 2048}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <Link 
                href="/admin/studio/settings"
                className="w-full text-center block rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-900 p-2.5 text-slate-700 dark:text-slate-200 font-bold transition-colors"
              >
                Gerenciar Chaves e Providers
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* RICH TEXT POPUP PREVIEW EDITOR */}
      {selectedGen && (
        <ContentPreview 
          generation={selectedGen}
          onClose={() => setSelectedGen(null)}
          onDelete={handleDelete}
          onSave={handleSave}
          onPublish={handlePublish}
        />
      )}

    </div>
  );
}
