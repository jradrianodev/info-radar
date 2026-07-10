'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Article, Category } from '@/lib/seedData';
import { Plus, Edit2, Trash2, FileText, Save, X, RefreshCw, Eye } from 'lucide-react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [readTime, setReadTime] = useState('5');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('published');
  
  // SEO Meta tags
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const arts = await dbService.getArticles();
    const cats = await dbService.getCategories();
    setArticles(arts);
    setCategories(cats);
    if (cats.length > 0) setCategoryId(cats[0].id);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setContent('');
    setImageUrl('');
    setCategoryId(categories[0]?.id || '');
    setReadTime('5');
    setStatus('published');
    setMetaTitle('');
    setMetaDescription('');
    setModalOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSlug(art.slug);
    setSummary(art.summary);
    setContent(art.content);
    setImageUrl(art.image_url);
    setCategoryId(art.category_id);
    setReadTime(art.read_time.toString());
    setStatus(art.status);
    setMetaTitle(art.meta_title || '');
    setMetaDescription(art.meta_description || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !categoryId) return;

    const payload = {
      title,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      summary,
      content,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=60',
      category_id: categoryId,
      read_time: parseInt(readTime) || 5,
      status,
      meta_title: metaTitle,
      meta_description: metaDescription
    };

    try {
      if (editingId) {
        await dbService.updateArticle(editingId, payload);
      } else {
        await dbService.createArticle(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar artigo.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este artigo?')) return;
    try {
      await dbService.deleteArticle(id);
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Artigos</h1>
          <p className="text-xs text-slate-500">Escreva notícias, guias de compra e artigos focados em SEO</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold px-4 py-2 hover:scale-[1.01] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Escrever Artigo</span>
        </button>
      </div>

      {/* List Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-brand-blue" />
            <span>Carregando artigos...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                <th className="p-4">Título</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Leitura</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {articles.map(art => {
                const cat = categories.find(c => c.id === art.category_id);
                return (
                  <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-800 dark:text-slate-200">
                    <td className="p-4 font-bold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand-blue" />
                      <span className="truncate max-w-[240px]">{art.title}</span>
                    </td>
                    <td className="p-4 text-slate-500">{cat?.name || 'Sem Categoria'}</td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">{art.read_time} min</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        art.status === 'published' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border border-slate-700'
                      }`}>
                        {art.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(art)}
                        className="p-1 text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(art.id)}
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
                {editingId ? 'Editar Artigo' : 'Escrever Novo Artigo'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-4.5 w-4.5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Título do Artigo</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingId) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                    placeholder="Ex: Como escolher placa de vídeo"
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
                    placeholder="como-escolher-placa-de-video"
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
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Tempo de Leitura (min)</label>
                  <input
                    type="number"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">URL Imagem de Capa</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Resumo do Artigo</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white h-14 resize-none"
                  placeholder="Resuma o conteúdo em uma ou duas frases para SEO..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Conteúdo (Suporta Markdown)</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white h-36 font-mono text-[11px]"
                  placeholder="### Título Seção&#10;Escreva o conteúdo aqui...&#10;&#10;* Item de lista"
                  required
                />
              </div>

              {/* SEO Block */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg space-y-3 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Metadados SEO</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 block">Meta Title</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 text-slate-900 dark:text-white"
                      placeholder="Title"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 block">Meta Description</label>
                    <input
                      type="text"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 text-slate-900 dark:text-white"
                      placeholder="Description"
                    />
                  </div>
                </div>
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
                  <span>Salvar Artigo</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
