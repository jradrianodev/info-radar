import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET() {
  const articles = await dbService.getArticles();
  const baseUrl = 'https://inforadar.com.br';

  const feedItems = articles
    .map((art) => `
      <item>
        <title>${escapeXml(art.title)}</title>
        <link>${baseUrl}/artigos/${art.slug}</link>
        <guid>${baseUrl}/artigos/${art.slug}</guid>
        <pubDate>${new Date(art.published_at || new Date()).toUTCString()}</pubDate>
        <description>${escapeXml(art.summary || '')}</description>
      </item>
    `)
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>InfoRadar - Feed de Artigos</title>
        <link>${baseUrl}</link>
        <description>Reviews, comparativos e guias de compra inteligentes de tecnologia.</description>
        <language>pt-br</language>
        ${feedItems}
      </channel>
    </rss>
  `;

  return new NextResponse(rssFeed.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
