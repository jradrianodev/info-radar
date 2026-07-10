import React, { Suspense } from 'react';
import { dbService } from '@/lib/db';
import SearchClient from './SearchClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Busca de Tecnologia | InfoRadar',
  description: 'Pesquise por produtos, análises técnicas, comparativos de preços e guias de compra.',
};

export default async function SearchPage() {
  // Pre-fetch all data on the server for speed and SEO
  const categories = await dbService.getCategories();
  const products = await dbService.getProducts();
  const reviews = await dbService.getReviews();
  const articles = await dbService.getArticles();

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-brand-dark pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={<div className="text-center py-12 text-slate-500">Carregando busca...</div>}>
          <SearchClient 
            initialCategories={categories}
            initialProducts={products}
            initialReviews={reviews}
            initialArticles={articles}
          />
        </Suspense>
      </div>
    </div>
  );
}

