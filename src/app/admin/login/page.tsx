'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          router.push('/admin/dashboard');
        }
      } else {
        // Mock session check
        const mockSession = localStorage.getItem('info-radar-admin-session');
        if (mockSession) {
          router.push('/admin/dashboard');
        }
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrorMsg(error.message);
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        // Fallback login
        if (email === 'admin@inforadar.com.br' && password === 'admin123') {
          localStorage.setItem('info-radar-admin-session', 'true');
          router.push('/admin/dashboard');
        } else {
          setErrorMsg('Credenciais incorretas. Use admin@inforadar.com.br e admin123.');
        }
      }
    } catch {
      setErrorMsg('Ocorreu um erro ao processar a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 md:p-8 shadow-xl glow-blue">
        
        {/* Top Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue text-white mb-2">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Acesso SuperAdmin</h1>
          <p className="text-xs text-slate-500">Faça login para gerenciar o catálogo da InfoRadar</p>
        </div>

        {/* Warning local database */}
        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-500 flex gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Modo de Teste Local Ativado</span>
              <p className="text-slate-400 font-medium">Supabase não configurado no .env. Faça login usando:</p>
              <p className="font-mono text-slate-300 mt-1 select-all">User: admin@inforadar.com.br</p>
              <p className="font-mono text-slate-300 select-all">Pass: admin123</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
              required
            />
          </div>

          {errorMsg && <p className="text-[11px] text-red-500 font-medium">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold py-3 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Entrar no Dashboard'}
          </button>
        </form>

      </div>
    </div>
  );
}
