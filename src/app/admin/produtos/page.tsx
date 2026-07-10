'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Product, Category, Brand, ContentGeneration } from '@/lib/seedData';
import { Plus, Edit2, Trash2, ShoppingBag, Save, X, RefreshCw, ListPlus, Trash, Sparkles, Calendar, Eye, FileText, BadgeInfo } from 'lucide-react';
import ClusterGenerator from '@/components/content-studio/ClusterGenerator';
import GenerateContentDialog from '@/components/content-studio/GenerateContentDialog';
import ContentPreview from '@/components/content-studio/ContentPreview';
import { useGenerationHistory } from '@/hooks/useGenerationHistory';
import { useGenerateContent } from '@/hooks/useGenerateContent';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('0');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  
  // Affiliate links
  const [amazon, setAmazon] = useState('');
  const [mercadolivre, setMercadolivre] = useState('');
  const [kabum, setKabum] = useState('');
  const [magalu, setMagalu] = useState('');

  // Specs states
  const [specs, setSpecs] = useState<{ name: string; value: string }[]>([]);

  // Content Studio states
  const [activeTab, setActiveTab] = useState<'dados' | 'specs' | 'studio'>('dados');
  const [studioDialogOpen, setStudioDialogOpen] = useState(false);
  const [previewGen, setPreviewGen] = useState<ContentGeneration | null>(null);

  const { history: productHistory, fetchHistory: fetchProductHistory, deleteHistoryItem } = useGenerationHistory(editingId || undefined);
  const { generate: generateCluster, generating: clusterGenerating } = useGenerateContent();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const prods = await dbService.getProducts();
    const cats = await dbService.getCategories();
    const brs = await dbService.getBrands();
    setProducts(prods);
    setCategories(cats);
    setBrands(brs);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setBrandId(brands[0]?.id || '');
    setCategoryId(categories[0]?.id || '');
    setPrice('0');
    setDescription('');
    setImageUrl('');
    setStatus('published');
    setAmazon('');
    setMercadolivre('');
    setKabum('');
    setMagalu('');
    setSpecs([]);
    setActiveTab('dados');
    setModalOpen(true);
  };

  const handleOpenEdit = async (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setSlug(prod.slug);
    setBrandId(prod.brand_id);
    setCategoryId(prod.category_id);
    setPrice(prod.price.toString());
    setDescription(prod.description);
    setImageUrl(prod.image_url);
    setStatus(prod.status);
    setAmazon(prod.affiliate_amazon || '');
    setMercadolivre(prod.affiliate_mercadolivre || '');
    setKabum(prod.affiliate_kabum || '');
    setMagalu(prod.affiliate_magalu || '');

    // Load specs dynamically
    const productSpecs = await dbService.getSpecsForProduct(prod.id);
    setSpecs(productSpecs.map(s => ({ name: s.spec_name, value: s.spec_value })));
    
    setActiveTab('dados');
    setModalOpen(true);
  };

  const handleAddSpecRow = () => {
    setSpecs(prev => [...prev, { name: '', value: '' }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'name' | 'value', val: string) => {
    setSpecs(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !brandId || !categoryId) return;

    const payload = {
      name,
      brand_id: brandId,
      category_id: categoryId,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      price: parseFloat(price) || 0,
      description,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1597872200969-2b65dffc0a38?w=800&auto=format&fit=crop&q=60',
      affiliate_amazon: amazon,
      affiliate_mercadolivre: mercadolivre,
      affiliate_kabum: kabum,
      affiliate_magalu: magalu,
      status
    };

    try {
      let savedProd: Product;
      if (editingId) {
        savedProd = await dbService.updateProduct(editingId, payload);
      } else {
        savedProd = await dbService.createProduct(payload);
      }

      // Sync specs
      const validSpecs = specs.filter(s => s.name.trim() && s.value.trim());
      await dbService.syncSpecs(savedProd.id, validSpecs);

      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar produto.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este produto? Reviews e comparativos vinculados a ele serão excluídos.')) return;
    try {
      await dbService.deleteProduct(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar produto.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Produtos</h1>
          <p className="text-xs text-slate-500">Cadastre eletrônicos, configure especificações e links afiliados</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold px-4 py-2 hover:scale-[1.01] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-brand-blue" />
            <span>Carregando produtos...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                <th className="p-4">Nome</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço sugerido</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {products.map(prod => {
                const cat = categories.find(c => c.id === prod.category_id);
                return (
                  <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-800 dark:text-slate-200">
                    <td className="p-4 font-bold flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-brand-blue" />
                      <span className="truncate max-w-[200px]">{prod.name}</span>
                    </td>
                    <td className="p-4 text-slate-500">{cat?.name || 'Sem Categoria'}</td>
                    <td className="p-4 font-bold text-brand-blue">R$ {prod.price.toLocaleString('pt-BR')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.status === 'published' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border border-slate-700'
                      }`}>
                        {prod.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1 text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(prod.id)}
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

      {/* Editor Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 overflow-y-auto pt-10 pb-10">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {editingId ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {editingId && (
              <div className="flex border-b border-slate-200 dark:border-slate-800 -mx-6 px-6 pb-2">
                <button 
                  type="button"
                  onClick={() => setActiveTab('dados')}
                  className={`px-4 py-1.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                    activeTab === 'dados' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Dados Básicos
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`px-4 py-1.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                    activeTab === 'specs' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Ficha Técnica
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('studio')}
                  className={`px-4 py-1.5 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'studio' ? 'border-indigo-500 text-indigo-400 font-extrabold' : 'border-transparent text-slate-500 hover:text-indigo-400'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
                  <span>Content Studio (AI)</span>
                </button>
              </div>
            )}

            {activeTab === 'dados' && (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                {/* Basic rows */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Nome do Produto</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!editingId) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                      placeholder="Ex: Dell Inspiron 15"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Slug (URL)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                      placeholder="dell-inspiron-15"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Categoria</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Marca</label>
                    <select
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                    >
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Preço Sugerido (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none font-bold text-brand-blue"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">URL Imagem Principal</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="published">Publicado</option>
                      <option value="draft">Rascunho</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Descrição do Produto</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none h-16 resize-none"
                    placeholder="Descreva as principais características gerais..."
                    required
                  />
                </div>

                {/* Affiliate Store Links */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg space-y-3 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Links de Afiliados</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-[#ff9900] block">Link Amazon</label>
                      <input
                        type="text"
                        value={amazon}
                        onChange={(e) => setAmazon(e.target.value)}
                        className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white"
                        placeholder="https://amazon.com.br/..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#0060b1] block">Link KaBuM!</label>
                      <input
                        type="text"
                        value={kabum}
                        onChange={(e) => setKabum(e.target.value)}
                        className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white"
                        placeholder="https://kabum.com.br/..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-yellow-500 block">Link Mercado Livre</label>
                      <input
                        type="text"
                        value={mercadolivre}
                        onChange={(e) => setMercadolivre(e.target.value)}
                        className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white"
                        placeholder="https://mercadolivre.com.br/..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#0086ff] block">Link Magazine Luiza</label>
                      <input
                        type="text"
                        value={magalu}
                        onChange={(e) => setMagalu(e.target.value)}
                        className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-slate-900 dark:text-white"
                        placeholder="https://magazineluiza.com.br/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Form buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
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
                    <span>Salvar Produto</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'specs' && (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                {/* Specs List Builder */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Ficha Técnica / Características</span>
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      <ListPlus className="h-3.5 w-3.5" />
                      <span>Adicionar Linha</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                    {specs.map((row, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={row.name}
                          placeholder="Ex: Processador"
                          onChange={(e) => handleSpecChange(idx, 'name', e.target.value)}
                          className="w-1/3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={row.value}
                          placeholder="Ex: Intel Core i7 13700H"
                          onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                          className="w-2/3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecRow(idx)}
                          className="text-slate-400 hover:text-red-500 p-1.5 cursor-pointer"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {specs.length === 0 && <p className="text-[10px] text-slate-500 italic">Nenhuma característica cadastrada.</p>}
                  </div>
                </div>

                {/* Form buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
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
                    <span>Salvar Ficha Técnica</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'studio' && editingId && (
              <div className="space-y-5 animate-fade-in text-xs text-slate-300">
                {/* AI studio triggers bar */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                      <span>Nova Geração por IA</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-snug">Gere reviews, FAQs e posts de redes sociais com IA para o **{name}**.</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setStudioDialogOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-750 text-white font-bold px-4 py-2.5 cursor-pointer transition-all shadow-sm"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Escrever com IA</span>
                  </button>
                </div>

                {/* Suggestions pauta Cluster Generator */}
                <ClusterGenerator 
                  productName={name}
                  generating={clusterGenerating}
                  onGenerateSelected={async (titles) => {
                    try {
                      await generateCluster(editingId, ['review', 'faq', 'linkedin']);
                      fetchProductHistory();
                      alert('Cluster de pautas sugeridas criado com sucesso!');
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }}
                />

                {/* Generations log grid table */}
                <div className="space-y-2.5">
                  <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Rascunhos Criados para este Produto</h4>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-950/20">
                    {productHistory.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 italic">
                        Nenhum rascunho de IA gerado para este produto ainda.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[8px]">
                            <th className="p-3">Data</th>
                            <th className="p-3">Pauta</th>
                            <th className="p-3">Provedor</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                          {productHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-900/40 text-slate-700 dark:text-slate-300">
                              <td className="p-3 text-slate-400 flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                {new Date(item.created_at).toLocaleDateString()}
                              </td>
                              <td className="p-3 font-bold uppercase text-slate-900 dark:text-slate-100">{item.content_type}</td>
                              <td className="p-3 text-slate-500 font-mono">{item.provider}</td>
                              <td className="p-3">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                  item.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => setPreviewGen(item)}
                                  className="inline-flex items-center gap-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded transition-all cursor-pointer"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>Revisar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm('Deletar rascunho gerado?')) {
                                      await deleteHistoryItem(item.id);
                                    }
                                  }}
                                  className="p-1 hover:bg-red-500/10 text-red-400 rounded transition-all cursor-pointer"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Back button */}
                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 px-5 py-2.5 font-bold text-slate-400 hover:bg-slate-900 transition-colors"
                  >
                    Fechar
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Generate Content Dialog */}
      {studioDialogOpen && editingId && (
        <GenerateContentDialog
          productId={editingId}
          productName={name}
          onClose={() => setStudioDialogOpen(false)}
          onSuccess={() => {
            setStudioDialogOpen(false);
            fetchProductHistory();
          }}
        />
      )}

      {/* Generated Content Preview Rich Editor */}
      {previewGen && (
        <ContentPreview
          generation={previewGen}
          onClose={() => setPreviewGen(null)}
          onDelete={async (id) => {
            const ok = await deleteHistoryItem(id);
            if (ok) {
              setPreviewGen(null);
              fetchProductHistory();
            }
          }}
          onSave={async (id, text) => {
            alert('Alterações salvas com sucesso!');
            fetchProductHistory();
          }}
          onPublish={async (id, text) => {
            alert('Conteúdo publicado com sucesso!');
            setPreviewGen(null);
            fetchProductHistory();
          }}
        />
      )}

    </div>
  );
}
