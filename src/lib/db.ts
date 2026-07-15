import { supabase, isSupabaseConfigured } from './supabase';
import { mockDb, Category, Brand, Product, ProductSpec, Review, Comparison, Article, Newsletter, Setting, Prompt, ContentGeneration, AISettings } from './seedData';

// DB ADAPTER SERVICES LAYER
export const dbService = {
  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) return data as Category[];
      console.warn('Supabase categories empty or error, using mock:', error?.message);
    }
    return mockDb.getCategories();
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
      if (!error && data) return data as Category;
    }
    return mockDb.getCategoryBySlug(slug) || null;
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').insert([category]).select().single();
      if (!error && data) return data as Category;
      throw new Error(error?.message || 'Error inserting category into Supabase');
    }
    return mockDb.createCategory(category);
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Category;
      throw new Error(error?.message || 'Error updating category in Supabase');
    }
    return mockDb.updateCategory(id, updates) as Category;
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) return true;
      throw new Error(error.message);
    }
    return mockDb.deleteCategory(id);
  },

  // BRANDS
  async getBrands(): Promise<Brand[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('brands').select('*');
      if (!error && data) return data as Brand[];
    }
    return mockDb.getBrands();
  },

  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) return data as Product[];
    }
    return mockDb.getProducts();
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
      if (!error && data) return data as Product;
    }
    return mockDb.getProductBySlug(slug) || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return data as Product;
    }
    return mockDb.getProductById(id) || null;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').insert([product]).select().single();
      if (!error && data) return data as Product;
      throw new Error(error?.message || 'Error inserting product into Supabase');
    }
    return mockDb.createProduct(product);
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Product;
      throw new Error(error?.message || 'Error updating product in Supabase');
    }
    return mockDb.updateProduct(id, updates) as Product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return true;
      throw new Error(error.message);
    }
    return mockDb.deleteProduct(id);
  },

  // SPECS
  async getSpecsForProduct(productId: string): Promise<ProductSpec[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('product_specs').select('*').eq('product_id', productId);
      if (!error && data) return data as ProductSpec[];
    }
    return mockDb.getSpecsForProduct(productId);
  },

  async syncSpecs(productId: string, specsList: { name: string; value: string }[]): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      // Clear and rewrite
      await supabase.from('product_specs').delete().eq('product_id', productId);
      const rows = specsList.map(s => ({ product_id: productId, spec_name: s.name, spec_value: s.value }));
      await supabase.from('product_specs').insert(rows);
      return;
    }
    mockDb.clearSpecs(productId);
    specsList.forEach(s => mockDb.addSpec(productId, s.name, s.value));
  },

  // REVIEWS
  async getReviews(): Promise<Review[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reviews').select('*');
      if (!error && data && data.length > 0) return data as Review[];
    }
    return mockDb.getReviews();
  },

  async getReviewByProductId(productId: string): Promise<Review | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reviews').select('*').eq('product_id', productId).single();
      if (!error && data) return data as Review;
    }
    return mockDb.getReviewByProductId(productId) || null;
  },

  async getReviewBySlug(slug: string): Promise<Review | null> {
    if (isSupabaseConfigured && supabase) {
      // get product first, then review
      const product = await this.getProductBySlug(slug);
      if (product) {
        return this.getReviewByProductId(product.id);
      }
      return null;
    }
    return mockDb.getReviewBySlug(slug) || null;
  },

  async createReview(review: Omit<Review, 'id'>): Promise<Review> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reviews').insert([review]).select().single();
      if (!error && data) return data as Review;
      throw new Error(error?.message || 'Error inserting review into Supabase');
    }
    return mockDb.createReview(review);
  },

  async updateReview(id: string, updates: Partial<Review>): Promise<Review> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reviews').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Review;
      throw new Error(error?.message || 'Error updating review in Supabase');
    }
    return mockDb.updateReview(id, updates) as Review;
  },

  async deleteReview(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (!error) return true;
      throw new Error(error.message);
    }
    return mockDb.deleteReview(id);
  },

  // COMPARISONS
  async getComparisons(): Promise<Comparison[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('comparisons').select('*');
      if (!error && data && data.length > 0) return data as Comparison[];
    }
    return mockDb.getComparisons();
  },

  async getComparisonBySlug(slug: string): Promise<Comparison | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('comparisons').select('*').eq('slug', slug).single();
      if (!error && data) {
        // Fetch comparison items too
        const { data: items } = await supabase.from('comparison_items').select('*').eq('comparison_id', data.id);
        return {
          ...data,
          items: items || []
        } as Comparison;
      }
    }
    return mockDb.getComparisonBySlug(slug) || null;
  },

  async createComparison(comparison: Omit<Comparison, 'id' | 'created_at'>): Promise<Comparison> {
    const { items, ...rest } = comparison;
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('comparisons').insert([rest]).select().single();
      if (!error && data) {
        if (items && items.length > 0) {
          const rows = items.map(it => ({ comparison_id: data.id, spec_name: it.spec_name, value_a: it.value_a, value_b: it.value_b }));
          await supabase.from('comparison_items').insert(rows);
        }
        return { ...data, items } as Comparison;
      }
      throw new Error(error?.message || 'Error creating comparison in Supabase');
    }
    return mockDb.createComparison(comparison);
  },

  async deleteComparison(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('comparisons').delete().eq('id', id);
      if (!error) return true;
      throw new Error(error.message);
    }
    return mockDb.deleteComparison(id);
  },

  // ARTICLES
  async getArticles(): Promise<Article[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('articles').select('*');
      if (!error && data && data.length > 0) {
        return data.map(art => ({
          ...art,
          author_name: 'Adriano José',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'
        })) as Article[];
      }
    }
    return mockDb.getArticles();
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
      if (!error && data) {
        return {
          ...data,
          author_name: 'Adriano José',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'
        } as Article;
      }
    }
    return mockDb.getArticleBySlug(slug) || null;
  },

  async createArticle(article: Omit<Article, 'id' | 'published_at' | 'author_name' | 'author_id'>): Promise<Article> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('articles').insert([article]).select().single();
      if (!error && data) return data as Article;
      throw new Error(error?.message || 'Error inserting article into Supabase');
    }
    return mockDb.createArticle(article);
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('articles').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Article;
      throw new Error(error?.message || 'Error updating article in Supabase');
    }
    return mockDb.updateArticle(id, updates) as Article;
  },

  async deleteArticle(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) return true;
      throw new Error(error.message);
    }
    return mockDb.deleteArticle(id);
  },

  // SETTINGS
  async getSettings(): Promise<Setting[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('settings').select('*');
      if (!error && data) return data as Setting[];
    }
    return mockDb.getSettings();
  },

  async updateSetting(key: string, value: string): Promise<Setting> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' }).select().single();
      if (!error && data) return data as Setting;
      throw new Error(error?.message || 'Error saving settings');
    }
    return mockDb.updateSetting(key, value) as Setting;
  },

  // NEWSLETTER
  async getNewsletterSubscribers(): Promise<Newsletter[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('newsletter').select('*');
      if (!error && data) return data as Newsletter[];
    }
    return mockDb.getNewsletterSubscribers();
  },

  async addNewsletterSubscriber(email: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('newsletter').insert({ email });
      return !error;
    }
    return !!mockDb.addNewsletterSubscriber(email);
  },

  // PROMPTS
  async getPrompts(): Promise<Prompt[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('prompts').select('*');
      if (!error && data) return data as Prompt[];
    }
    return mockDb.getPrompts();
  },

  async createPrompt(prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>): Promise<Prompt> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('prompts').insert([prompt]).select().single();
      if (!error && data) return data as Prompt;
      throw new Error(error?.message || 'Error inserting prompt into Supabase');
    }
    return mockDb.createPrompt(prompt);
  },

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('prompts').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Prompt;
      throw new Error(error?.message || 'Error updating prompt in Supabase');
    }
    return mockDb.updatePrompt(id, updates) as Prompt;
  },

  async deletePrompt(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('prompts').delete().eq('id', id);
      if (!error) return true;
      throw new Error(error.message);
    }
    return mockDb.deletePrompt(id);
  },

  // GENERATIONS
  async getGenerations(): Promise<ContentGeneration[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('content_generations').select('*');
      if (!error && data) return data as ContentGeneration[];
    }
    return mockDb.getGenerations();
  },

  async getGenerationsForProduct(productId: string): Promise<ContentGeneration[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('content_generations').select('*').eq('product_id', productId);
      if (!error && data) return data as ContentGeneration[];
    }
    return mockDb.getGenerationsForProduct(productId);
  },

  async createGeneration(generation: Omit<ContentGeneration, 'id' | 'created_at' | 'updated_at'>): Promise<ContentGeneration> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('content_generations').insert([generation]).select().single();
      if (!error && data) return data as ContentGeneration;
      throw new Error(error?.message || 'Error inserting generation into Supabase');
    }
    return mockDb.createGeneration(generation);
  },

  async deleteGeneration(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('content_generations').delete().eq('id', id);
      if (!error) return true;
      throw new Error(error.message);
    }
    return mockDb.deleteGeneration(id);
  },

  // AISettings
  async getAISettings(): Promise<AISettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('ai_settings').select('*').single();
      if (!error && data) return data as AISettings;
    }
    return mockDb.getAISettings();
  },

  async updateAISettings(updates: Partial<AISettings>): Promise<AISettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('ai_settings').upsert({ id: 1, ...updates }).select().single();
      if (!error && data) return data as AISettings;
      throw new Error(error?.message || 'Error saving AI settings');
    }
    return mockDb.updateAISettings(updates);
  }
};
