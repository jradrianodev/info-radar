'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Newsletter } from '@/lib/seedData';
import { Mail, Download, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const subs = await dbService.getNewsletterSubscribers();
    setSubscribers(subs);
    setLoading(false);
  };

  // CSV Export utility
  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      alert('Nenhum assinante cadastrado para exportação.');
      return;
    }

    const headers = 'ID,Email,Data de Inscricao\n';
    const rows = subscribers
      .map(sub => `"${sub.id}","${sub.email}","${new Date(sub.created_at).toLocaleDateString('pt-BR')}"`)
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `newsletter_inforadar_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assinantes Newsletter</h1>
          <p className="text-xs text-slate-500 font-semibold">Exporte e-mails cadastrados para ferramentas de marketing (ex: Mailchimp)</p>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-750 text-white text-xs font-bold px-4 py-2 hover:scale-[1.01] transition-all cursor-pointer shadow-sm"
        >
          {exported ? <CheckCircle2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          <span>{exported ? 'Exportado!' : 'Exportar CSV'}</span>
        </button>
      </div>

      {/* Main lists */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-brand-blue" />
            <span>Carregando lista...</span>
          </div>
        ) : (
          <div>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs font-bold text-slate-400">
              Total de Assinantes: {subscribers.length}
            </div>

            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  <th className="p-4">E-mail</th>
                  <th className="p-4">Data de Inscrição</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {subscribers.length > 0 ? (
                  subscribers.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-800 dark:text-slate-200">
                      <td className="p-4 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-brand-blue" />
                        <span>{sub.email}</span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(sub.created_at).toLocaleDateString('pt-BR')} às {new Date(sub.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => alert('Para maior segurança de leads, remoções manuais devem ser solicitadas via banco.')}
                          className="p-1 text-slate-400 hover:text-slate-200 cursor-help"
                          title="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500 text-xs italic">Nenhum e-mail inscrito ainda. Inscreva-se usando o formulário do rodapé!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
