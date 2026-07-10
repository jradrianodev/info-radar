'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Category } from '@/lib/seedData';
import { Plus, Edit2, Trash2, Tag, Save, X, Sparkles, RefreshCw } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('Laptop');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await dbService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setIcon('Laptop');
    setImageUrl('');
    setDescription('');
    setMetaTitle('');
    setMetaDescription('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon);
    setImageUrl(cat.image_url);
    setDescription(cat.description);
    setMetaTitle(cat.meta_title || '');
    setMetaDescription(cat.meta_description || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    const payload = {
      name,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      icon,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
      description,
      meta_title: metaTitle,
      meta_description: metaDescription
    };

    try {
      if (editingId) {
        await dbService.updateCategory(editingId, payload);
      } else {
        await dbService.createCategory(payload);
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar categoria.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta categoria? Os produtos vinculados podem ficar sem categoria.')) return;
    
    try {
      await dbService.deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar categoria.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Categorias</h1>
          <p className="text-xs text-slate-500">Adicione e configure categorias de produtos e SEO tags</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold px-4 py-2 hover:scale-[1.01] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Main List Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-brand-blue" />
            <span>Carregando categorias...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                <th className="p-4">Nome</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Ícone Lucide</th>
                <th className="p-4">Descrição</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-800 dark:text-slate-200">
                  <td className="p-4 font-bold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-brand-blue" />
                    <span>{cat.name}</span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-500">{cat.slug}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-500">{cat.icon}</td>
                  <td className="p-4 text-slate-500 line-clamp-1 max-w-[200px]">{cat.description}</td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1 text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Excluir"
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

      {/* Editor Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card shadow-2xl animate-scale-in p-6 space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {editingId ? 'Editar Categoria' : 'Criar Nova Categoria'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingId) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                    placeholder="Ex: Monitor Gamer"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Slug (URL amigável)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                    placeholder="ex-monitor-gamer"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Ícone Lucide</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                    placeholder="Laptop, Smartphone, etc."
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">URL da Imagem</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Descrição Interna</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none h-16 resize-none"
                  placeholder="Explique o tipo de produtos dessa categoria..."
                />
              </div>

              {/* SEO Block */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg space-y-3 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
                  <span>SEO Meta Tags</span>
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Meta Title</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 text-slate-900 dark:text-white"
                      placeholder="Title para buscador"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Meta Description</label>
                    <input
                      type="text"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      className="w-full rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 text-slate-900 dark:text-white"
                      placeholder="Description resumida"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white font-bold px-4 py-2 transition-all cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
