'use client';

import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, FolderOpen, AlertCircle, FileSpreadsheet, FileText, CheckCircle } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  compressionRatio: string;
}

export default function AdminMediaPage() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([
    { id: '1', name: 'macbook_air_m3.jpg', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=60', size: '142 KB', type: 'image/jpeg', compressionRatio: 'WebP Comp: -62%' },
    { id: '2', name: 'galaxy_s24_ultra.png', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&auto=format&fit=crop&q=60', size: '210 KB', type: 'image/png', compressionRatio: 'WebP Comp: -78%' },
    { id: '3', name: 'kingston_nvme.jpg', url: 'https://images.unsplash.com/photo-1597872200969-2b65dffc0a38?w=300&auto=format&fit=crop&q=60', size: '98 KB', type: 'image/jpeg', compressionRatio: 'WebP Comp: -54%' },
  ]);

  const [uploadedAlert, setUploadedAlert] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0].name);
    }
  };

  const simulateUpload = (fileName: string) => {
    const randomImg = [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=60'
    ][Math.floor(Math.random() * 3)];

    const newFile: MediaFile = {
      id: Date.now().toString(),
      name: fileName.toLowerCase().replace(/\s+/g, '_'),
      url: randomImg,
      size: '64 KB',
      type: 'image/webp',
      compressionRatio: 'Compresso automática: WebP'
    };

    setFiles(prev => [newFile, ...prev]);
    setUploadedAlert(true);
    setTimeout(() => setUploadedAlert(false), 3000);
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Biblioteca de Mídia</h1>
        <p className="text-xs text-slate-500">Faça upload de fotos para reviews e artigos. Compressão automática WebP ativada.</p>
      </div>

      {/* Drag & Drop Area */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-10 text-center space-y-4 transition-colors cursor-pointer ${
          dragActive 
            ? 'border-brand-blue bg-brand-blue/5' 
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card hover:border-brand-blue'
        }`}
        onClick={() => simulateUpload(`tech_photo_${Date.now().toString().slice(-4)}.jpg`)}
      >
        <div className="h-12 w-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mx-auto shadow-sm">
          <Upload className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Arraste e solte fotos de hardware aqui ou clique para simular upload</p>
          <p className="text-[10px] text-slate-500">Imagens JPG, PNG e WEBP são otimizadas localmente</p>
        </div>
      </div>

      {/* Notification banner */}
      {uploadedAlert && (
        <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-3 text-xs text-emerald-500 flex gap-2 items-center animate-scale-in">
          <CheckCircle className="h-4 w-4" />
          <span>Upload concluído! Imagem comprimida para WebP com sucesso.</span>
        </div>
      )}

      {/* Media Grid */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Arquivos na Biblioteca ({files.length})</span>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {files.map(f => (
            <div 
              key={f.id} 
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card overflow-hidden group shadow-sm flex flex-col justify-between"
            >
              <div className="aspect-video bg-slate-900 relative">
                <img src={f.url} alt={f.name} className="object-cover h-full w-full" />
                <button
                  onClick={() => handleDelete(f.id)}
                  className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-black/60 border border-slate-700/50 backdrop-blur-xs text-red-500 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3 text-[10px] font-medium space-y-1">
                <span className="text-slate-800 dark:text-slate-200 font-bold block truncate" title={f.name}>{f.name}</span>
                <div className="flex justify-between items-center text-slate-500">
                  <span>{f.size}</span>
                  <span className="text-emerald-500 font-bold">{f.compressionRatio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
