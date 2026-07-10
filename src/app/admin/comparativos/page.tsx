'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Product, Comparison } from '@/lib/seedData';
import { Plus, Trash2, GitCompare, Save, X, RefreshCw, RefreshCcw, Table, Trash } from 'lucide-react';

export default function AdminComparisonsPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [productAId, setProductAId] = useState('');
  const [productBId, setProductBId] = useState('');
  const [verdict, setVerdict] = useState('');

  // Pros & Cons lists
  const [proInputA, setProInputA] = useState('');
  const [prosA, setProsA] = useState<string[]>([]);
  const [contraInputA, setContraInputA] = useState('');
  const [contrasA, setContrasA] = useState<string[]>([]);

  const [proInputB, setProInputB] = useState('');
  const [prosB, setProsB] = useState<string[]>([]);
  const [contraInputB, setContraInputB] = useState('');
  const [contrasB, setContrasB] = useState<string[]>([]);

  // Comparison specs table
  const [comparisonItems, setComparisonItems] = useState<{ spec_name: string; value_a: string; value_b: string }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const comps = await dbService.getComparisons();
    const prods = await dbService.getProducts();
    setComparisons(comps);
    setProducts(prods);
    if (prods.length > 1) {
      setProductAId(prods[0].id);
      setProductBId(prods[1].id);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    if (products.length > 1) {
      setProductAId(products[0].id);
      setProductBId(products[1].id);
    }
    setVerdict('');
    setProsA([]);
    setContrasA([]);
    setProsB([]);
    setContrasB([]);
    setComparisonItems([]);
    setModalOpen(true);
  };

  // Auto-generate specs comparison table rows
  const handleAutoGenerateTable = async () => {
    if (!productAId || !productBId || productAId === productBId) {
      alert('Selecione dois produtos diferentes para comparar.');
      return;
    }

    const specsA = await dbService.getSpecsForProduct(productAId);
    const specsB = await dbService.getSpecsForProduct(productBId);

    // Merge names to find common parameters
    const allNames = Array.from(new Set([
      ...specsA.map(s => s.spec_name),
      ...specsB.map(s => s.spec_name)
    ]));

    const generated = allNames.map(name => {
      const valA = specsA.find(s => s.spec_name === name)?.spec_value || '-';
      const valB = specsB.find(s => s.spec_name === name)?.spec_value || '-';
      return {
        spec_name: name,
        value_a: valA,
        value_b: valB
      };
    });

    setComparisonItems(generated);

    // Also auto-generate titles and slugs
    const prodA = products.find(p => p.id === productAId);
    const prodB = products.find(p => p.id === productBId);
    if (prodA && prodB) {
      setTitle(`${prodA.name} vs ${prodB.name}`);
      setSlug(`${prodA.slug}-vs-${prodB.slug}`);
      setDescription(`Comparativo técnico completo entre o ${prodA.name} e o ${prodB.name}. Ficha técnica detalhada e prós/contras.`);
    }
  };

  const handleAddSpecRow = () => {
    setComparisonItems(prev => [...prev, { spec_name: '', value_a: '', value_b: '' }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setComparisonItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'spec_name' | 'value_a' | 'value_b', val: string) => {
    setComparisonItems(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productAId || !productBId || !title || !slug) return;

    const payload = {
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      title,
      description,
      product_a_id: productAId,
      product_b_id: productBId,
      pros_a: prosA,
      contras_a: contrasA,
      pros_b: prosB,
      contras_b: contrasB,
      verdict,
      items: comparisonItems.filter(it => it.spec_name.trim())
    };

    try {
      await dbService.createComparison(payload);
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar comparativo.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este comparativo?')) return;
    try {
      await dbService.deleteComparison(id);
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Comparativos</h1>
          <p className="text-xs text-slate-500">Crie batalhas de especificações entre produtos e escreva o veredito</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold px-4 py-2 hover:scale-[1.01] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Comparativo</span>
        </button>
      </div>

      {/* List Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-brand-blue" />
            <span>Carregando comparativos...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                <th className="p-4">Duelo</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Características</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {comparisons.map(comp => (
                <tr key={comp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-800 dark:text-slate-200">
                  <td className="p-4 font-bold flex items-center gap-2">
                    <GitCompare className="h-4 w-4 text-indigo-400" />
                    <span>{comp.title}</span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-500">{comp.slug}</td>
                  <td className="p-4 text-slate-500 font-semibold text-[11px]">
                    {comp.items?.length || 0} especificações comparadas
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(comp.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 overflow-y-auto pt-10 pb-10">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white">Novo Comparativo Lado a Lado</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-4.5 w-4.5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {/* Product Selectors */}
              <div className="grid grid-cols-5 items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-400 block uppercase">Produto A</label>
                  <select
                    value={productAId}
                    onChange={(e) => setProductAId(e.target.value)}
                    className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white"
                  >
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-span-1 text-center font-bold text-indigo-400 text-sm">VS</div>
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-400 block uppercase">Produto B</label>
                  <select
                    value={productBId}
                    onChange={(e) => setProductBId(e.target.value)}
                    className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white"
                  >
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="col-span-5 flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleAutoGenerateTable}
                    className="inline-flex items-center gap-1 bg-brand-blue hover:bg-brand-blue-hover text-white px-4 py-2 rounded-lg font-bold shadow"
                  >
                    <Table className="h-4 w-4" />
                    <span>Auto-Gerar Ficha e Título</span>
                  </button>
                </div>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Título do Comparativo</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                    placeholder="Dell XPS 13 vs MacBook Air M3"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Slug (URL)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                    placeholder="dell-xps-13-vs-macbook-air-m3"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Resumo descritivo</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white h-14 resize-none"
                  placeholder="Introduza a disputa..."
                />
              </div>

              {/* Comparison items table specifications manually editable */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Batalha de Fichas</span>
                  <button type="button" onClick={handleAddSpecRow} className="bg-slate-950 border border-slate-800 px-2 py-1 rounded font-bold hover:bg-slate-800">Adicionar Linha</button>
                </div>
                
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {comparisonItems.map((row, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={row.spec_name}
                        placeholder="Característica (Ex: Bateria)"
                        onChange={(e) => handleSpecChange(idx, 'spec_name', e.target.value)}
                        className="w-1/3 rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={row.value_a}
                        placeholder="Valor Produto A"
                        onChange={(e) => handleSpecChange(idx, 'value_a', e.target.value)}
                        className="w-1/3 rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white font-bold"
                      />
                      <input
                        type="text"
                        value={row.value_b}
                        placeholder="Valor Produto B"
                        onChange={(e) => handleSpecChange(idx, 'value_b', e.target.value)}
                        className="w-1/3 rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white font-bold"
                      />
                      <button type="button" onClick={() => handleRemoveSpecRow(idx)} className="text-slate-400 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">O Veredito Final</label>
                <textarea
                  value={verdict}
                  onChange={(e) => setVerdict(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white h-16 resize-none"
                  placeholder="Escreva quem vence o duelo e por quê..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white font-bold px-4 py-2 transition-all shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Salvar Comparativo</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
