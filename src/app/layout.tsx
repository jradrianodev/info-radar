import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'InfoRadar - Encontre a tecnologia certa antes de comprar.',
  description: 'Portal completo de reviews, comparativos, guias de compra e recomendações de tecnologia orientadas pelo Radar IA.',
  keywords: ['notebook', 'celular', 'monitor', 'SSD', 'memória RAM', 'teclado', 'headset', 'smart home', 'Radar IA'],
  metadataBase: new URL('https://inforadar.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'InfoRadar - Reviews e Comparações Tecnológicas',
    description: 'Encontre a tecnologia certa antes de comprar com nosso recomendador inteligente.',
    url: 'https://inforadar.com.br',
    siteName: 'InfoRadar',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InfoRadar - Reviews e Comparações Tecnológicas',
    description: 'Encontre a tecnologia certa antes de comprar com nosso recomendador inteligente.',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark h-full antialiased" style={{ colorScheme: 'dark' }}>
      <body className="min-h-full flex flex-col bg-brand-dark text-slate-100 font-sans selection:bg-brand-blue selection:text-white">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
