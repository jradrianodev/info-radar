# InfoRadar MVP

> **Slogan:** Encontre a tecnologia certa antes de comprar.

O **InfoRadar** é um portal completo de avaliações técnicas, comparativos de especificações, guias de compra e recomendações de tecnologia. O portal foi projetado com uma experiência do usuário (UX/UI) minimalista e premium (inspirada em Apple, Stripe, Linear e Perplexity), rodando sob alto desempenho e foco em SEO.

---

## 🛠️ Tecnologias e Stack

- **Framework:** React 19 + Next.js 15 (App Router, Server-Side Components)
- **Styling & Animações:** Tailwind CSS v4 + Framer Motion
- **Banco de Dados & Auth:** Supabase (PostgreSQL + RLS + Storage)
- **Formulários & Validação:** React Hook Form + Zod
- **Gerenciamento de Tabelas:** TanStack Table
- **Ícones:** Lucide Icons
- **Efeitos de Partículas:** Canvas Confetti

---

## 📂 Estrutura de Pastas do Projeto

```text
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── admin/              # Painel SuperAdmin (Login, CRUDs, Mídia)
│   │   ├── artigos/            # Detalhes de Artigos (Rich Text render)
│   │   ├── comparativos/       # Batalhas de Especificações e Veredito
│   │   ├── produtos/           # Detalhes de hardware e Preço Afiliados
│   │   ├── radar-ia/           # landing page do Radar IA
│   │   ├── reviews/            # Notas técnicas, Prós e Contras
│   │   ├── search/             # Filtro de Busca unificada client-side
│   │   ├── globals.css         # CSS Global, Variações de Cores e Poppins
│   │   ├── layout.tsx          # Layout Principal com Meta Tags SEO
│   │   ├── page.tsx            # Homepage Hero, Categorias e Destaques
│   │   ├── robots.ts           # Robots.txt dinâmico do Next.js
│   │   └── sitemap.ts          # Sitemap.xml dinâmico do Next.js
│   ├── components/             # Componentes Compartilhados (Header, Footer, RadarIA)
│   └── lib/                    # Camada do Banco de Dados (Supabase & MockDb Fallback)
├── supabase_schema.sql         # Script SQL Completo de Inicialização
└── README.md                   # Documentação do Projeto
```

---

## 🚀 Instalação e Execução Local

### 1. Clonar e Instalar Dependências
No terminal do projeto, execute:
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente (Opcional)
Se desejar integrar ao seu projeto no Supabase, crie um arquivo `.env.local` na raiz com suas credenciais:
```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

> 💡 **Nota de Facilidade (Fallback):** Se você não configurar o `.env.local`, a plataforma entra automaticamente em **Modo Fallback com Banco Local Stateful**. Todas as listagens, Radar IA, newsletter e formulários CRUD funcionarão perfeitamente em memória!

### 3. Executar o Servidor de Desenvolvimento
Inicie o servidor local:
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## ⚙️ Configuração do Banco de Dados no Supabase

Para carregar toda a estrutura de tabelas, índices e políticas de segurança RLS no Supabase:
1. Acesse o painel do seu projeto no **Supabase**.
2. Vá até o menu **SQL Editor**.
3. Clique em **New Query**.
4. Copie o conteúdo de [supabase_schema.sql](./supabase_schema.sql) e cole no editor.
5. Clique em **Run**.

---

## 🛡️ Acesso ao Painel SuperAdmin

Para testar o gerenciamento completo de Categorias, Produtos, Reviews, Comparativos, Artigos, Mídias e ver a exportação de leads da Newsletter em CSV:
- **URL do Painel:** `/admin/login` (ou clique no ícone de engrenagem no cabeçalho).
- **Dados de Acesso (Modo Local Fallback):**
  - **E-mail:** `admin@inforadar.com.br`
  - **Senha:** `admin123`

---

## 🌟 Principais Diferenciais e Recursos

1. **Radar IA:** Recomendador de produtos baseado em 7 perguntas (orçamento, uso, peso, sistema operacional, marca, etc.) com cálculo local de pontuação (Match % e confetti animado).
2. **SEO First:** Sitemap.xml automatizado, robots.txt amigável, feeds RSS em `/feed`, tags canônicas, e esquemas JSON-LD.
3. **Affiliate Engine:** Botões dedicados de links de afiliados estilizados individualmente por loja parceira (Amazon, KaBuM, Mercado Livre, Magalu) para maximizar comissão.
4. **Design Apple/Stripe:** Dark mode nativo com paleta de cores institucional em Marinho (#0D1321), Azul Royal (#2563EB) e cinzas translúcidos (glassmorphism).
