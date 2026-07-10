'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Product, Review } from '@/lib/seedData';
import { Plus, Edit2, Trash2, MessageSquare, Save, X, RefreshCw, Star, Trash } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [productId, setProductId] = useState('');
  const [rating, setRating] = useState('8.5');
  const [summary, setSummary] = useState('');
  const [conclusion, setConclusion] = useState('');
  
  // Pros/Cons lists
  const [proInput, setProInput] = useState('');
  const [pros, setPros] = useState<string[]>([]);
  
  const [contraInput, setContraInput] = useState('');
  const [contras, setContras] = useState<string[]>([]);

  // Key-value specs
  const [testedSpecs, setTestedSpecs] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const revs = await dbService.getReviews();
    const prods = await dbService.getProducts();
    setReviews(revs);
    setProducts(prods);
    if (prods.length > 0) setProductId(prods[0].id);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setProductId(products[0]?.id || '');
    setRating('8.5');
    setSummary('');
    setConclusion('');
    setPros([]);
    setContras([]);
    setTestedSpecs([
      { key: 'Desempenho', value: 'Excelente' },
      { key: 'Construção', value: 'Premium' }
    ]);
    setModalOpen(true);
  };

  const handleOpenEdit = (rev: Review) => {
    setEditingId(rev.id);
    setProductId(rev.product_id);
    setRating(rev.rating.toString());
    setSummary(rev.summary);
    setConclusion(rev.conclusion);
    setPros(rev.pros);
    setContras(rev.contras);
    setTestedSpecs(Object.entries(rev.specs_table).map(([k, v]) => ({ key: k, value: v })));
    setModalOpen(true);
  };

  const handleAddPro = () => {
    if (!proInput.trim()) return;
    setPros(prev => [...prev, proInput.trim()]);
    setProInput('');
  };

  const handleRemovePro = (idx: number) => {
    setPros(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddContra = () => {
    if (!contraInput.trim()) return;
    setContras(prev => [...prev, contraInput.trim()]);
    setContraInput('');
  };

  const handleRemoveContra = (idx: number) => {
    setContras(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddSpecRow = () => {
    setTestedSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setTestedSpecs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) => {
    setTestedSpecs(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    // Convert specs array to object
    const specs_table: Record<string, string> = {};
    testedSpecs.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specs_table[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      product_id: productId,
      rating: parseFloat(rating) || 8.0,
      pros,
      contras,
      summary,
      conclusion,
      specs_table,
      gallery: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60'
      ]
    };

    try {
      if (editingId) {
        await dbService.updateReview(editingId, payload);
      } else {
        await dbService.createReview(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar review.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este review?')) return;
    try {
      await dbService.deleteReview(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Reviews</h1>
          <p className="text-xs text-slate-500">Escreva avaliações aprofundadas, prós/contras e atribua notas</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold px-4 py-2 hover:scale-[1.01] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Escrever Review</span>
        </button>
      </div>

      {/* List Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-brand-blue" />
            <span>Carregando reviews...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                <th className="p-4">Produto</th>
                <th className="p-4">Nota</th>
                <th className="p-4">Prós / Contras</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {reviews.map(rev => {
                const prod = products.find(p => p.id === rev.product_id);
                return (
                  <tr key={rev.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-800 dark:text-slate-200">
                    <td className="p-4 font-bold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-brand-blue animate-pulse" />
                      <span>{prod?.name || 'Produto Não Encontrado'}</span>
                    </td>
                    <td className="p-4 font-bold text-amber-500 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{rev.rating.toFixed(1)}</span>
                    </td>
                    <td className="p-4 text-slate-500 font-semibold text-[11px]">
                      {rev.pros.length} Prós / {rev.contras.length} Contras
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(rev)}
                        className="p-1 text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(rev.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 overflow-y-auto pt-10 pb-10">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {editingId ? 'Editar Review' : 'Novo Review Técnico'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-4.5 w-4.5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Produto Vinculado</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                    disabled={!!editingId}
                  >
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Nota Técnica (0.0 a 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none font-bold text-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Resumo Técnico</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none h-16 resize-none"
                  placeholder="Resuma as descobertas iniciais em um parágrafo..."
                  required
                />
              </div>

              {/* Pros & Cons list sync */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Pros */}
                <div className="space-y-2 p-3 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg">
                  <span className="font-bold text-emerald-500 block uppercase">Prós</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Novo ponto forte"
                      value={proInput}
                      onChange={(e) => setProInput(e.target.value)}
                      className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 text-slate-900 dark:text-white"
                    />
                    <button type="button" onClick={handleAddPro} className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded font-bold">Add</button>
                  </div>
                  <ul className="space-y-1 max-h-24 overflow-y-auto">
                    {pros.map((p, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800 text-[11px] text-slate-300">
                        <span className="truncate pr-2">{p}</span>
                        <button type="button" onClick={() => handleRemovePro(idx)} className="text-slate-400 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-2 p-3 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg">
                  <span className="font-bold text-red-500 block uppercase">Contras</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Novo ponto fraco"
                      value={contraInput}
                      onChange={(e) => setContraInput(e.target.value)}
                      className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 text-slate-900 dark:text-white"
                    />
                    <button type="button" onClick={handleAddContra} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded font-bold">Add</button>
                  </div>
                  <ul className="space-y-1 max-h-24 overflow-y-auto">
                    {contras.map((c, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800 text-[11px] text-slate-300">
                        <span className="truncate pr-2">{c}</span>
                        <button type="button" onClick={() => handleRemoveContra(idx)} className="text-slate-400 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Tested specs characteristics table */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Características Testadas</span>
                  <button type="button" onClick={handleAddSpecRow} className="bg-slate-900 border border-slate-800 px-2 py-1 rounded font-bold hover:bg-slate-800">Nova Linha</button>
                </div>
                <div className="space-y-2 max-h-28 overflow-y-auto">
                  {testedSpecs.map((row, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={row.key}
                        placeholder="Ex: Desempenho em Jogos"
                        onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                        className="w-1/3 rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={row.value}
                        placeholder="Ex: 8.9 / 10"
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        className="w-2/3 rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white"
                      />
                      <button type="button" onClick={() => handleRemoveSpecRow(idx)} className="text-slate-400 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Conclusão e Veredito</label>
                <textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none h-16 resize-none"
                  placeholder="Escreva a conclusão resumindo se vale a pena a compra..."
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white font-bold px-4 py-2 transition-all shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Salvar Review</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
