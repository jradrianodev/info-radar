'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';
import { dbService } from '@/lib/db';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Por favor, insira um e-mail válido.');
      return;
    }
    
    setSubmitting(true);
    setErrorMsg('');
    
    try {
      const res = await dbService.addNewsletterSubscriber(email);
      if (res) {
        setSuccess(true);
        setEmail('');
      } else {
        setErrorMsg('Este e-mail já está inscrito em nossa newsletter.');
      }
    } catch {
      setErrorMsg('Ocorreu um erro. Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-white dark:bg-[#080d19] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-12 md:py-16 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-light tracking-tight text-slate-900 dark:text-white leading-none">
                Info<span className="font-bold text-brand-blue">Radar</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Encontre a tecnologia certa antes de comprar. Reviews independentes, comparativos detalhados e curadoria inteligente.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-brand-blue transition-colors" aria-label="Twitter">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-brand-blue transition-colors" aria-label="Github">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-brand-blue transition-colors" aria-label="LinkedIn">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Navegar</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/search?tab=categorias" className="hover:text-brand-blue transition-colors">Categorias de Tech</Link></li>
              <li><Link href="/search?tab=reviews" className="hover:text-brand-blue transition-colors">Análises de Produtos</Link></li>
              <li><Link href="/comparativos" className="hover:text-brand-blue transition-colors">Comparativos Lado a Lado</Link></li>
              <li><Link href="/search?tab=artigos" className="hover:text-brand-blue transition-colors">Guias de Compra</Link></li>
            </ul>
          </div>

          {/* Legal / Institutional */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">InfoRadar</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-brand-blue transition-colors">Sobre nós</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Como testamos</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Política de Afiliados</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Privacidade e Termos</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-brand-blue" />
              <span>Newsletter Semanal</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Receba os melhores descontos e lançamentos de tecnologia diretamente no seu e-mail.
            </p>

            {success ? (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 animate-scale-in">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Inscrição realizada com sucesso!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-blue focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-medium px-4 py-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    Inscrever
                  </button>
                </div>
                {errorMsg && <p className="text-[10px] text-red-500">{errorMsg}</p>}
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} InfoRadar. Todos os direitos reservados. Links patrocinados podem render comissões.</p>
          <div className="flex items-center gap-1.5 font-semibold text-brand-blue">
            <Sparkles className="h-3 w-3" />
            <span>Feito com Design Premium</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
