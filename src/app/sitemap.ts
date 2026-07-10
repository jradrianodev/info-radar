import { MetadataRoute } from 'next';
import { dbService } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://inforadar.com.br';

  try {
    const products = await dbService.getProducts();
    const articles = await dbService.getArticles();
    const comparisons = await dbService.getComparisons();

    const productUrls = products.map((prod) => ({
      url: `${baseUrl}/produtos/${prod.slug}`,
      lastModified: new Date(prod.created_at || new Date()),
    }));

    const articleUrls = articles.map((art) => ({
      url: `${baseUrl}/artigos/${art.slug}`,
      lastModified: new Date(art.published_at || new Date()),
    }));

    const comparisonUrls = comparisons.map((comp) => ({
      url: `${baseUrl}/comparativos/${comp.slug}`,
      lastModified: new Date(comp.created_at || new Date()),
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/radar-ia`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/search`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      },
      ...productUrls,
      ...articleUrls,
      ...comparisonUrls,
    ];
  } catch (error) {
    console.error('Error generating sitemap, returning fallback:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      }
    ];
  }
}
