'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Sparkles, 
  Save, 
  ShieldAlert,
  Loader2,
  Key,
  HelpCircle
} from 'lucide-react';
import { useAISettings } from '@/hooks/useAISettings';

export default function AISettingsPage() {
  const { settings, loading, saving, saveSettings } = useAISettings();
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('gemini-1.5-pro');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [timeout, setTimeoutVal] = useState(30000);
  const [retry, setRetry] = useState(3);
  
  // Custom states for credentials
  const [geminiKey, setGeminiKey] = useState('gemini-mock-key-123');
  const [openaiKey, setOpenaiKey] = useState('openai-mock-key-456');
  const [claudeKey, setClaudeKey] = useState('claude-mock-key-789');
  const [deepseekKey, setDeepseekKey] = useState('deepseek-mock-key-012');

  useEffect(() => {
    if (settings) {
      setProvider(settings.provider);
      setModel(settings.model);
      setTemperature(settings.temperature);
      setMaxTokens(settings.max_tokens);
      setTimeoutVal(settings.timeout);
      setRetry(settings.retry);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSettings({
        provider,
        model,
        temperature,
        max_tokens: maxTokens,
        timeout,
        retry,
        api_key: provider === 'gemini' ? geminiKey : provider === 'openai' ? openaiKey : provider === 'claude' ? claudeKey : deepseekKey
      });
      alert('Configurações de IA salvas com sucesso!');
    } catch (err: any) {
      alert('Erro ao salvar as configurações: ' + err.message);
    }
  };

  return (
    <div className="flex-1 space-y-6 text-xs text-slate-300">
      
      {/* Navigation sub header */}
      <div className="flex justify-between items-center bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Settings className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white">IA Configurações do Sistema</h1>
            <p className="text-[10px] text-slate-400">Gerencie credenciais dos provedores e parâmetros padrão de geração</p>
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
            className="px-3.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white font-bold transition-colors"
          >
            Prompt Manager
          </Link>
          <Link 
            href="/admin/studio/settings" 
            className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20"
          >
            Configuração IA
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="h-8 w-8 text-brand-blue animate-spin mx-auto" />
          <span className="mt-2 block">Carregando configurações de IA...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main configuration form */}
          <form 
            onSubmit={handleSubmit}
            className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 space-y-6"
          >
            
            {/* General parameters heading */}
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                <span>Parâmetros Padrão de IA</span>
              </h3>
              <p className="text-[10px] text-slate-400">Ajuste o comportamento geral das gerações se o prompt não sobrescrever</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400">Provedor Padrão</label>
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none focus:border-brand-blue"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI GPT</option>
                  <option value="claude">Anthropic Claude</option>
                  <option value="deepseek">DeepSeek AI</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400">Modelo Padrão</label>
                <input 
                  type="text"
                  required
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none focus:border-brand-blue"
                  placeholder="Ex: gemini-1.5-pro"
                />
              </div>

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400">Tamanho Máximo (Tokens)</label>
                <input 
                  type="number"
                  required
                  value={maxTokens}
                  onChange={e => setMaxTokens(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none focus:border-brand-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400">Timeout (milissegundos)</label>
                <input 
                  type="number"
                  required
                  value={timeout}
                  onChange={e => setTimeoutVal(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none focus:border-brand-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400">Tentativas (Retries)</label>
                <input 
                  type="number"
                  required
                  value={retry}
                  onChange={e => setRetry(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none focus:border-brand-blue"
                />
              </div>

            </div>

            {/* API Credentials heading */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Key className="h-4 w-4 text-indigo-400" />
                  <span>API Keys de Provedores</span>
                </h4>
                <p className="text-[10px] text-slate-400">As chaves são armazenadas criptografadas com segurança e nunca são expostas publicamente.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">Google Gemini Key</label>
                  <input 
                    type="password"
                    value={geminiKey}
                    onChange={e => setGeminiKey(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">OpenAI Key</label>
                  <input 
                    type="password"
                    value={openaiKey}
                    onChange={e => setOpenaiKey(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">Anthropic Claude Key</label>
                  <input 
                    type="password"
                    value={claudeKey}
                    onChange={e => setClaudeKey(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">DeepSeek Key</label>
                  <input 
                    type="password"
                    value={deepseekKey}
                    onChange={e => setDeepseekKey(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Save action button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white font-bold px-6 py-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Salvar Configurações</span>
              </button>
            </div>

          </form>

          {/* Right Column: Roles guard warnings */}
          <div className="space-y-4">
            
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.02] p-5 space-y-3">
              <h3 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="h-4.5 w-4.5" />
                <span>Restrição de SuperAdmin</span>
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                Este painel de chaves de API e alteração de provedores globais de IA é restrito. 
                Editores e Autores de conteúdo geral podem apenas visualizar as configurações ativas, mas não salvar novos valores ou revelar chaves.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-5 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="h-4.5 w-4.5 text-indigo-400" />
                <span>Sobre as Estimativas</span>
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                O custo dos rascunhos é calculado de acordo com a tabela oficial de preços de cada provedor por milhão de tokens (Input / Output). 
                Recomendamos o uso de **Google Gemini** para maior velocidade e melhor custo-benefício em português brasileiro.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
