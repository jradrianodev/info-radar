export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image_url: string;
  description: string;
  meta_title?: string;
  meta_description?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  brand_id: string;
  category_id: string;
  slug: string;
  price: number;
  description: string;
  image_url: string;
  affiliate_amazon?: string;
  affiliate_mercadolivre?: string;
  affiliate_kabum?: string;
  affiliate_magalu?: string;
  status: 'draft' | 'published';
  created_at: string;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
}

export interface Review {
  id: string;
  product_id: string;
  rating: number; // 0.0 to 10.0
  pros: string[];
  contras: string[];
  summary: string;
  conclusion: string;
  specs_table: Record<string, string>;
  gallery: string[];
}

export interface Comparison {
  id: string;
  slug: string;
  title: string;
  description: string;
  product_a_id: string;
  product_b_id: string;
  pros_a: string[];
  contras_a: string[];
  pros_b: string[];
  contras_b: string[];
  verdict: string;
  items: { spec_name: string; value_a: string; value_b: string }[];
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string;
  category_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  read_time: number;
  status: 'draft' | 'published' | 'scheduled';
  published_at: string;
  meta_title?: string;
  meta_description?: string;
}

export interface Newsletter {
  id: string;
  email: string;
  created_at: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
}

export interface Prompt {
  id: string;
  name: string;
  category: string;
  provider: string;
  model: string;
  version: string;
  temperature: number;
  prompt: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentGeneration {
  id: string;
  product_id: string;
  provider: string;
  model: string;
  prompt_id: string;
  content_type: string;
  request?: string;
  response: string;
  draft_id?: string;
  status: 'draft' | 'published';
  tokens_input: number;
  tokens_output: number;
  estimated_cost: number;
  execution_time: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AISettings {
  provider: string;
  model: string;
  temperature: number;
  max_tokens: number;
  timeout: number;
  retry: number;
  api_key?: string;
}

// Initial Data Seeds
export const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Notebook', slug: 'notebook', icon: 'Laptop', image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60', description: 'Reviews e comparativos dos melhores notebooks do mercado.', meta_title: 'Notebooks | InfoRadar', meta_description: 'Descubra os melhores notebooks do ano com reviews aprofundados e comparativos detalhados.' },
  { id: 'cat-2', name: 'Celular', slug: 'celular', icon: 'Smartphone', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60', description: 'Reviews e guias de smartphones premium e intermediários.', meta_title: 'Celulares e Smartphones | InfoRadar', meta_description: 'Qual celular comprar? Veja nosso guia completo de smartphones.' },
  { id: 'cat-3', name: 'Monitor', slug: 'monitor', icon: 'Monitor', image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60', description: 'Monitores para trabalho, design e gaming de alta performance.', meta_title: 'Monitores | InfoRadar', meta_description: 'Comparações de monitores 4K, ultrawide e gamer.' },
  { id: 'cat-4', name: 'SSD', slug: 'ssd', icon: 'HardDrive', image_url: 'https://images.unsplash.com/photo-1597872200969-2b65dffc0a38?w=800&auto=format&fit=crop&q=60', description: 'SSDs NVMe de altíssima velocidade e custo-benefício.', meta_title: 'SSDs | InfoRadar', meta_description: 'Análises de SSDs NVMe e SATA. Velocidade máxima para seu setup.' },
  { id: 'cat-5', name: 'Memória RAM', slug: 'ram', icon: 'Cpu', image_url: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=800&auto=format&fit=crop&q=60', description: 'Desempenho e latência de kits de memória DDR4 e DDR5.', meta_title: 'Memória RAM | InfoRadar', meta_description: 'Review das melhores memórias RAM DDR4 e DDR5.' },
  { id: 'cat-6', name: 'Mouse', slug: 'mouse', icon: 'MousePointer', image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=60', description: 'Mouses gamer e ergonômicos produtividade.', meta_title: 'Mouses | InfoRadar', meta_description: 'Comparativos e reviews de mouses sem fio e gamer.' },
  { id: 'cat-7', name: 'Teclado', slug: 'teclado', icon: 'Keyboard', image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60', description: 'Teclados mecânicos, membrana e custo-benefício.', meta_title: 'Teclados | InfoRadar', meta_description: 'Reviews de teclados mecânicos e ergonômicos.' },
  { id: 'cat-8', name: 'Smart Home', slug: 'smart-home', icon: 'Home', image_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=60', description: 'Automatização residencial, assistentes e lâmpadas inteligentes.', meta_title: 'Smart Home | InfoRadar', meta_description: 'Casa inteligente conectada. Veja os melhores dispositivos Alexa e Google.' },
  { id: 'cat-9', name: 'Áudio', slug: 'audio', icon: 'Headphones', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60', description: 'Headsets, fones TWS e caixas de som de alta fidelidade.', meta_title: 'Áudio | InfoRadar', meta_description: 'Os melhores headsets gamer e fones Bluetooth do mercado.' },
  { id: 'cat-10', name: 'IA', slug: 'ia', icon: 'Sparkles', image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60', description: 'Hardwares otimizados para IA e inteligência artificial no dia a dia.', meta_title: 'Tecnologia IA | InfoRadar', meta_description: 'Guias e análises sobre IA e computadores com NPU dedicada.' }
];

export const initialBrands: Brand[] = [
  { id: 'b-1', name: 'Apple', slug: 'apple' },
  { id: 'b-2', name: 'Dell', slug: 'dell' },
  { id: 'b-3', name: 'Samsung', slug: 'samsung' },
  { id: 'b-4', name: 'Logitech', slug: 'logitech' },
  { id: 'b-5', name: 'Kingston', slug: 'kingston' },
  { id: 'b-6', name: 'Razer', slug: 'razer' },
  { id: 'b-7', name: 'Lenovo', slug: 'lenovo' },
  { id: 'b-8', name: 'ASUS', slug: 'asus' },
  { id: 'b-9', name: 'LG', slug: 'lg' }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'MacBook Air M3 (13 polegadas)',
    brand_id: 'b-1',
    category_id: 'cat-1',
    slug: 'macbook-air-m3-13',
    price: 11499.00,
    description: 'O notebook ultrafino mais cobiçado do mundo, agora equipado com o processador M3 da Apple. Desempenho incrível, refrigeração passiva silenciosa e bateria que dura o dia inteiro.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    affiliate_amazon: 'https://amazon.com.br',
    affiliate_mercadolivre: 'https://mercadolivre.com.br',
    affiliate_kabum: 'https://kabum.com.br',
    affiliate_magalu: 'https://magazineluiza.com.br',
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Dell XPS 13 (Intel Core Ultra)',
    brand_id: 'b-2',
    category_id: 'cat-1',
    slug: 'dell-xps-13-intel-ultra',
    price: 12999.00,
    description: 'O ápice do design premium do ecossistema Windows. Com tela OLED sensacional, teclado sem bordas e o novo chip Intel Core Ultra com recursos de IA local.',
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=60',
    affiliate_amazon: 'https://amazon.com.br',
    affiliate_kabum: 'https://kabum.com.br',
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'iPhone 15 Pro Max',
    brand_id: 'b-1',
    category_id: 'cat-2',
    slug: 'iphone-15-pro-max',
    price: 8999.00,
    description: 'Smartphone premium da Apple com acabamento em Titânio aeroespacial, câmera zoom periscópio 5x de alta definição e o inovador botão de Ação configurável.',
    image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=60',
    affiliate_amazon: 'https://amazon.com.br',
    affiliate_mercadolivre: 'https://mercadolivre.com.br',
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Samsung Galaxy S24 Ultra',
    brand_id: 'b-3',
    category_id: 'cat-2',
    slug: 'galaxy-s24-ultra',
    price: 7499.00,
    description: 'O topo de linha supremo do Android. Inclui tela antirreflexo espetacular, corpo de titânio, caneta S-Pen integrada e a suíte completa de Inteligência Artificial Galaxy AI.',
    image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60',
    affiliate_amazon: 'https://amazon.com.br',
    affiliate_mercadolivre: 'https://mercadolivre.com.br',
    affiliate_magalu: 'https://magazineluiza.com.br',
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'SSD NVMe Kingston KC3000 2TB',
    brand_id: 'b-5',
    category_id: 'cat-4',
    slug: 'ssd-kingston-kc3000-2tb',
    price: 989.00,
    description: 'Um dos SSDs PCIe 4.0 mais rápidos do mercado, alcançando impressionantes 7.000 MB/s de leitura. Ideal para workstations e perfeitamente compatível com o PlayStation 5.',
    image_url: 'https://images.unsplash.com/photo-1597872200969-2b65dffc0a38?w=800&auto=format&fit=crop&q=60',
    affiliate_amazon: 'https://amazon.com.br',
    affiliate_kabum: 'https://kabum.com.br',
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Logitech MX Master 3S',
    brand_id: 'b-4',
    category_id: 'cat-6',
    slug: 'logitech-mx-master-3s',
    price: 599.00,
    description: 'O mouse ergonômico favorito dos programadores, designers e profissionais de produtividade. Rolagem eletromagnética MagSpeed e clique extremamente silencioso.',
    image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=60',
    affiliate_amazon: 'https://amazon.com.br',
    affiliate_mercadolivre: 'https://mercadolivre.com.br',
    status: 'published',
    created_at: new Date().toISOString()
  }
];

export const initialProductSpecs: ProductSpec[] = [
  // MacBook Air M3
  { id: 'spec-1', product_id: 'prod-1', spec_name: 'Processador', spec_value: 'Apple M3 (8 núcleos CPU, 10 núcleos GPU)' },
  { id: 'spec-2', product_id: 'prod-1', spec_name: 'Memória RAM', spec_value: '8GB / 16GB / 24GB Unified Memory' },
  { id: 'spec-3', product_id: 'prod-1', spec_name: 'Armazenamento', spec_value: '256GB / 512GB / 1TB / 2TB SSD' },
  { id: 'spec-4', product_id: 'prod-1', spec_name: 'Tela', spec_value: '13.6 polegadas Liquid Retina OLED IPS (2560x1664)' },
  { id: 'spec-5', product_id: 'prod-1', spec_name: 'Bateria', spec_value: 'Até 18 horas de reprodução de vídeo' },
  { id: 'spec-6', product_id: 'prod-1', spec_name: 'Peso', spec_value: '1.24 kg' },
  
  // Dell XPS 13
  { id: 'spec-7', product_id: 'prod-2', spec_name: 'Processador', spec_value: 'Intel Core Ultra 7 155H (16 núcleos, NPU de IA integrada)' },
  { id: 'spec-8', product_id: 'prod-2', spec_name: 'Memória RAM', spec_value: '16GB / 32GB LPDDR5x' },
  { id: 'spec-9', product_id: 'prod-2', spec_name: 'Armazenamento', spec_value: '512GB / 1TB PCIe Gen 4 SSD' },
  { id: 'spec-10', product_id: 'prod-2', spec_name: 'Tela', spec_value: '13.4 polegadas InfinityEdge OLED Touch (2880x1800)' },
  { id: 'spec-11', product_id: 'prod-2', spec_name: 'Bateria', spec_value: 'Até 11 horas de uso misto' },
  { id: 'spec-12', product_id: 'prod-2', spec_name: 'Peso', spec_value: '1.19 kg' },

  // iPhone 15 Pro Max
  { id: 'spec-13', product_id: 'prod-3', spec_name: 'Processador', spec_value: 'Apple A17 Pro (3nm)' },
  { id: 'spec-14', product_id: 'prod-3', spec_name: 'Câmeras', spec_value: 'Principal 48MP, Ultra angular 12MP, Teleobjetiva 5x 12MP' },
  { id: 'spec-15', product_id: 'prod-3', spec_name: 'Tela', spec_value: 'Super Retina XDR OLED 6.7" (120Hz)' },
  { id: 'spec-16', product_id: 'prod-3', spec_name: 'Material', spec_value: 'Titânio com vidro traseiro texturizado' },
  
  // Galaxy S24 Ultra
  { id: 'spec-17', product_id: 'prod-4', spec_name: 'Processador', spec_value: 'Snapdragon 8 Gen 3 for Galaxy' },
  { id: 'spec-18', product_id: 'prod-4', spec_name: 'Câmeras', spec_value: 'Principal 200MP, Ultra angular 12MP, Tele 5x 50MP, Tele 3x 10MP' },
  { id: 'spec-19', product_id: 'prod-4', spec_name: 'Tela', spec_value: 'Dynamic AMOLED 2X 6.8" Quad HD+ (120Hz, Gorilla Glass Armor)' },
  { id: 'spec-20', product_id: 'prod-4', spec_name: 'Bateria', spec_value: '5.000 mAh' }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-1',
    rating: 9.4,
    pros: [
      'Desempenho assombroso do chip M3 sem aquecimento',
      'Construção ultrafina icônica em alumínio reciclado',
      'Duração de bateria incrível de até 18 horas reais',
      'Sistema de som com 4 alto-falantes de altíssima fidelidade',
      'Carregamento magnético MagSafe'
    ],
    contras: [
      'Modelo básico vem com apenas 8GB de RAM e 256GB de SSD',
      'Preço extremamente elevado no mercado brasileiro',
      'Permite conectar apenas dois monitores externos (e com a tampa fechada)'
    ],
    summary: 'O MacBook Air M3 é o melhor notebook ultrafino disponível atualmente. A transição para o chip M3 traz velocidades aprimoradas em gráficos, suporte a Ray Tracing e aceleração de Inteligência Artificial via NPU dedicada. Para quem busca portabilidade sem abrir mão de potência e longevidade, ele continua sendo a escolha número um.',
    conclusion: 'Se você já possui um MacBook M1 ou anterior, ou está buscando um notebook de alta durabilidade, o MacBook Air M3 vale cada centavo investido. Recomendamos fortemente tentar adquirir a versão com 16GB de RAM para maior longevidade no fluxo de trabalho moderno.',
    specs_table: {
      'Processador': 'Apple M3',
      'Memória RAM': '16 GB Unificada',
      'Armazenamento': '512 GB SSD',
      'Bateria': '52.6 Wh (até 18h)',
      'Peso': '1.24 kg',
      'Conectividade': 'Wi-Fi 6E, Bluetooth 5.3, 2x Thunderbolt 4'
    },
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60'
    ]
  },
  {
    id: 'rev-2',
    product_id: 'prod-4',
    rating: 9.6,
    pros: [
      'Nova tela antirreflexo de Titânio que reduz 75% dos reflexos',
      'Recursos úteis da Inteligência Artificial do Galaxy AI',
      'Câmera principal de 200MP e novo sensor telefoto 5x de 50MP',
      'Suporte a atualizações de software do Android por 7 anos',
      'Bateria monstruosa que chega com folga a 2 dias de uso casual'
    ],
    contras: [
      'Corpo quadrado com cantos agudos pode incomodar mãos menores',
      'Sem carregador de alta potência na caixa',
      'Preço inicial assusta compradores tradicionais'
    ],
    summary: 'O Samsung Galaxy S24 Ultra refina a fórmula de sucesso da linha Note/Ultra. A substituição do vidro tradicional pelo Gorilla Armor cria uma tela que redefine a visibilidade sob o sol. Combinado com o processador premium e o ecossistema Galaxy AI, ele consolida seu lugar no topo do mercado mobile.',
    conclusion: 'O S24 Ultra é o smartphone definitivo para quem busca o máximo que a tecnologia móvel pode entregar hoje. Suas câmeras versáteis e a promessa de 7 anos de atualizações garantem que ele durará por muitos anos.',
    specs_table: {
      'Processador': 'Snapdragon 8 Gen 3',
      'Memória RAM': '12 GB',
      'Armazenamento': '256 GB / 512 GB / 1 TB',
      'Tela': '6.8" AMOLED 120Hz Dynamic 2X',
      'Câmeras': 'Traseira quádrupla (200MP + 50MP + 12MP + 10MP)',
      'Bateria': '5000 mAh'
    },
    gallery: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60'
    ]
  }
];

export const initialComparisons: Comparison[] = [
  {
    id: 'comp-1',
    slug: 'macbook-air-m3-vs-dell-xps-13-ultra',
    title: 'MacBook Air M3 vs Dell XPS 13 Core Ultra',
    description: 'Dois dos notebooks ultrafinos mais premium do planeta se enfrentam. macOS ou Windows? M3 ou Intel Core Ultra?',
    product_a_id: 'prod-1',
    product_b_id: 'prod-2',
    pros_a: [
      'Completamente silencioso (sem ventoinhas)',
      'Bateria muito superior em navegação de internet e produtividade leve',
      'Som surround nativo melhor distribuído',
      'Ecossistema integrado com iPhone e iPad'
    ],
    contras_a: [
      'Menos portas físicas',
      'Tela sem suporte ao toque (Touchscreen)'
    ],
    pros_b: [
      'Tela OLED sensível ao toque com cores mais profundas e pretos perfeitos',
      'Design futurista sem bordas ou frestas',
      'Compatibilidade universal com aplicativos e jogos do ecossistema Windows',
      'NPU otimizada para Windows Copilot'
    ],
    contras_b: [
      'Ventoinhas barulhentas sob alto processamento',
      'Vida útil de bateria inferior no dia a dia'
    ],
    verdict: 'O MacBook Air M3 continua sendo a melhor escolha geral para a grande maioria das pessoas devido ao seu consumo de energia eficiente, silêncio absoluto e consistência de desempenho fora da tomada. Contudo, se você trabalha intensamente com sistemas específicos de Windows ou valoriza uma tela OLED sensível ao toque, o Dell XPS 13 é o mais elegante e refinado produto no ecossistema concorrente.',
    items: [
      { spec_name: 'Processador', value_a: 'Apple M3 (8-core CPU)', value_b: 'Intel Core Ultra 7 155H' },
      { spec_name: 'Tela', value_a: '13.6" IPS Retina (500 nits)', value_b: '13.4" OLED InfinityEdge Touch' },
      { spec_name: 'Refrigeração', value_a: 'Passiva (Sem ventoinha, zero barulho)', value_b: 'Ativa (Duas ventoinhas)' },
      { spec_name: 'Bateria', value_a: 'Até 18 horas reais', value_b: 'Até 11 horas reais' },
      { spec_name: 'Peso', value_a: '1.24 kg', value_b: '1.19 kg' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'comp-2',
    slug: 'iphone-15-pro-max-vs-galaxy-s24-ultra',
    title: 'iPhone 15 Pro Max vs Samsung Galaxy S24 Ultra',
    description: 'O duelo supremo das câmeras de 2024. O zoom de 5x da Apple contra a caneta digital e os recursos de IA da Samsung.',
    product_a_id: 'prod-3',
    product_b_id: 'prod-4',
    pros_a: [
      'Mais leve e ergonômico de segurar devido às bordas arredondadas de titânio',
      'Gravação de vídeo em formato Log diretamente em SSD externo',
      'Interface do iOS muito estável com suporte a longo prazo'
    ],
    contras_a: [
      'Velocidade de carregamento limitada a 27W',
      'Ausência de recursos avançados de IA em português brasileiro nativo nesta versão'
    ],
    pros_b: [
      'Suíte de ferramentas baseada em inteligência artificial (Galaxy AI)',
      'Caneta inteligente S-Pen integrada de fábrica',
      'Tela plana com novo vidro antirreflexo espetacular',
      'Processador Snapdragon otimizado com suporte a Ray Tracing superior em jogos'
    ],
    contras_b: [
      'Aparência muito grande e cantos retos que incomodam o bolso',
      'Gravações de vídeo levemente inferiores em cenários noturnos'
    ],
    verdict: 'O Samsung Galaxy S24 Ultra vence por margem mínima neste comparativo por entregar mais funcionalidades integradas (S-Pen, IA robusta e melhor legibilidade de tela). No entanto, se o seu foco principal for a gravação profissional de vídeo, facilidade de uso de apps ou você já faz parte do ecossistema Apple, o iPhone 15 Pro Max é a escolha natural.',
    items: [
      { spec_name: 'Material do Corpo', value_a: 'Titânio Aeroespacial Grau 5', value_b: 'Titânio' },
      { spec_name: 'Tela', value_a: '6.7" OLED (120Hz)', value_b: '6.8" Flat Dynamic AMOLED 2X (120Hz, Antirreflexo)' },
      { spec_name: 'Processador', value_a: 'A17 Pro', value_b: 'Snapdragon 8 Gen 3 for Galaxy' },
      { spec_name: 'Câmera Zoom', value_a: '12MP Periscópio 5x', value_b: '50MP Telefoto 5x' },
      { spec_name: 'Caneta Stylus', value_a: 'Não compatível', value_b: 'S-Pen Inclusa' }
    ],
    created_at: new Date().toISOString()
  }
];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Guia de Compra: Como escolher o notebook ideal em 2026',
    slug: 'como-escolher-notebook-ideal-2026',
    summary: 'Explicamos o que você deve priorizar na hora da escolha: chips de inteligência artificial (NPUs), tamanho de tela, autonomia de bateria e quantidade ideal de memória RAM.',
    content: `A escolha de um notebook novo mudou drasticamente nos últimos anos. Já não basta apenas olhar para a quantidade de armazenamento ou se o processador é um Core i5 ou Core i7. Em 2026, a presença de uma NPU (Unidade de Processamento Neural) dedicada para tarefas de inteligência artificial local é um dos principais divisores de águas.

Neste guia completo, passamos pelos principais pontos que você deve analisar antes de comprar o seu próximo computador de trabalho ou estudos.

### 1. Processador e as Novas NPUs
Os chips mais modernos da Intel (Core Ultra), AMD (Ryzen AI) e Apple (M-series) agora trazem núcleos dedicados a IA. Eles aceleram tarefas como cancelamento de ruído em chamadas, desfocagem inteligente de fundos e até geração local de imagens sem sobrecarregar a bateria ou a placa gráfica principal.

### 2. Memória RAM: O Novo Mínimo é 16GB
Esqueça notebooks com 8GB de memória RAM se você planeja ficar com eles por mais de dois anos. Os navegadores modernos, somados às ferramentas de produtividade e IA rodando em segundo plano, consomem memória rapidamente. 16GB garante que seu sistema continuará fluido sob multitarefas pesadas.

### 3. Tela: Conforto Visual Importa
Evite painéis do tipo TN, que possuem péssimos ângulos de visão e cores lavadas. Priorize telas **IPS** ou **OLED**. Se você trabalha longas horas digitando, telas com proporção 16:10 ou 3:2 oferecem mais espaço vertical útil que a tradicional tela 16:9 de TVs.

### Conclusão
Pese suas necessidades. Se você precisa de máxima portabilidade e bateria que dura o dia todo, os MacBooks da Apple dominam. Se você precisa de compatibilidade de sistemas empresariais ou quer jogar ocasionalmente, as opções com Windows de fabricantes como Dell e Lenovo são ideais.`,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    category_id: 'cat-1',
    author_id: 'author-mock-1',
    author_name: 'Adriano José',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    read_time: 6,
    status: 'published',
    published_at: new Date().toISOString(),
    meta_title: 'Como escolher o notebook ideal em 2026 | InfoRadar',
    meta_description: 'Descubra quais especificações priorizar ao comprar um novo laptop: processadores com NPU, quantidade de RAM e telas ergonômicas.'
  },
  {
    id: 'art-2',
    title: 'A revolução do Wi-Fi 7: Vale a pena atualizar seus roteadores?',
    slug: 'revolucao-wifi-7-vale-a-pena',
    summary: 'A nova geração de redes sem fio promete velocidades absurdas e latência extremamente baixa. Entenda se já é o momento de fazer o upgrade no seu setup doméstico.',
    content: `O Wi-Fi 7 está chegando ao mercado de consumo com a promessa de transformar nossa experiência com redes domésticas. Com velocidades teóricas de transferência que ultrapassam os 40 Gbps e o uso inteligente de múltiplas frequências em simultâneo (MLO), os novos roteadores parecem saídos de um filme de ficção científica.

Mas será que você realmente precisa desse investimento agora?

### O que o Wi-Fi 7 traz de novo?
* **Canais de 320 MHz**: O dobro de largura de banda das redes Wi-Fi 6, reduzindo consideravelmente o congestionamento em áreas densas.
* **MLO (Multi-Link Operation)**: Permite que um mesmo celular ou notebook se conecte a duas frequências (ex: 5 GHz e 6 GHz) ao mesmo tempo, garantindo downloads mais rápidos e latência nula.
* **QAM 4096**: Modulação avançada que compacta mais dados por sinal de rádio transmitido.

### Você deve comprar agora?
Atualmente, roteadores Wi-Fi 7 custam fortunas. Além disso, você precisa de aparelhos compatíveis (como o Galaxy S24 Ultra ou MacBooks recentes) para tirar proveito da rede. Se sua casa já tem Wi-Fi 6 ou 6E funcional, esperar mais um ou dois anos fará você economizar bastante dinheiro à medida que a tecnologia se populariza.`,
    image_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=60',
    category_id: 'cat-8',
    author_id: 'author-mock-1',
    author_name: 'Adriano José',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    read_time: 4,
    status: 'published',
    published_at: new Date().toISOString(),
    meta_title: 'Wi-Fi 7 Vale a Pena? | InfoRadar',
    meta_description: 'Análise detalhada sobre as novidades do Wi-Fi 7, velocidades de rede, latência e se vale a pena o investimento inicial.'
  }
];

export const initialSettings: Setting[] = [
  { id: 1, key: 'site_logo', value: 'InfoRadar' },
  { id: 2, key: 'site_slogan', value: 'Encontre a tecnologia certa antes de comprar.' },
  { id: 3, key: 'site_meta_title', value: 'InfoRadar - Portal de Avaliações e Recomendações Tecnológicas' },
  { id: 4, key: 'site_meta_description', value: 'Compare produtos de tecnologia, veja reviews imparciais e faça a escolha certa com o Radar IA.' },
  { id: 5, key: 'google_analytics_id', value: 'G-123456789' },
  { id: 6, key: 'newsletter_endpoint', value: '' }
];

export const initialPrompts: Prompt[] = [
  {
    id: 'pr-1',
    name: 'Review Completo',
    category: 'review',
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    version: '1.0',
    temperature: 0.7,
    prompt: 'Escreva um review completo sobre o produto {product_name} ({product_description}). Liste pontos fortes e fracos.',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'pr-2',
    name: 'Guia de Compra',
    category: 'guia',
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    version: '1.0',
    temperature: 0.7,
    prompt: 'Crie um guia de compra detalhado para o {product_name}.',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'pr-3',
    name: 'FAQ Inteligente',
    category: 'faq',
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    version: '1.0',
    temperature: 0.5,
    prompt: 'Gere 5 perguntas e respostas frequentes para o {product_name}.',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'pr-4',
    name: 'Metadados SEO',
    category: 'seo',
    provider: 'openai',
    model: 'gpt-4o',
    version: '1.0',
    temperature: 0.3,
    prompt: 'Gere Meta Title e Meta Description focados em SEO para o {product_name}.',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'pr-5',
    name: 'Post de LinkedIn',
    category: 'linkedin',
    provider: 'openai',
    model: 'gpt-4o',
    version: '1.0',
    temperature: 0.8,
    prompt: 'Escreva um post corporativo para o LinkedIn divulgando o {product_name}.',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'pr-6',
    name: 'Script YouTube Shorts',
    category: 'shorts',
    provider: 'claude',
    model: 'claude-3-5-sonnet',
    version: '1.0',
    temperature: 0.7,
    prompt: 'Gere um roteiro dinâmico de 60 segundos sobre o {product_name}.',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const initialContentGenerations: ContentGeneration[] = [
  {
    id: 'gen-1',
    product_id: 'prod-1',
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    prompt_id: 'pr-1',
    content_type: 'review',
    request: 'Geração de review técnico',
    response: 'Review de teste do MacBook Air M3.',
    status: 'draft',
    tokens_input: 120,
    tokens_output: 450,
    estimated_cost: 0.0012,
    execution_time: 1450,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'gen-2',
    product_id: 'prod-1',
    provider: 'openai',
    model: 'gpt-4o',
    prompt_id: 'pr-4',
    content_type: 'seo',
    request: 'Metadados SEO',
    response: 'Title: MacBook Air M3 Review | Description: Ficha técnica do novo notebook.',
    status: 'draft',
    tokens_input: 90,
    tokens_output: 210,
    estimated_cost: 0.0031,
    execution_time: 980,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const initialAISettings: AISettings = {
  provider: 'gemini',
  model: 'gemini-1.5-pro',
  temperature: 0.7,
  max_tokens: 2048,
  timeout: 30000,
  retry: 3,
  api_key: 'sk-mock-12345'
};

// IN-MEMORY DATA STORE AND MUTATIONS (Mock Database Layer)
let categories = [...initialCategories];
let brands = [...initialBrands];
let products = [...initialProducts];
let specs = [...initialProductSpecs];
let reviews = [...initialReviews];
let comparisons = [...initialComparisons];
let articles = [...initialArticles];
let settings = [...initialSettings];
let newsletterSubscribers: Newsletter[] = [];
let prompts = [...initialPrompts];
let contentGenerations = [...initialContentGenerations];
let aiSettings = { ...initialAISettings };

export const mockDb = {
  // CATEGORIES
  getCategories: () => categories,
  getCategoryById: (id: string) => categories.find(c => c.id === id),
  getCategoryBySlug: (slug: string) => categories.find(c => c.slug === slug),
  createCategory: (item: Omit<Category, 'id'>) => {
    const newItem: Category = { ...item, id: `cat-${Date.now()}` };
    categories.push(newItem);
    return newItem;
  },
  updateCategory: (id: string, updates: Partial<Category>) => {
    categories = categories.map(c => c.id === id ? { ...c, ...updates } : c);
    return categories.find(c => c.id === id);
  },
  deleteCategory: (id: string) => {
    categories = categories.filter(c => c.id !== id);
    return true;
  },

  // BRANDS
  getBrands: () => brands,
  getBrandById: (id: string) => brands.find(b => b.id === id),
  createBrand: (name: string) => {
    const newBrand: Brand = { id: `b-${Date.now()}`, name, slug: name.toLowerCase().replace(/\s+/g, '-') };
    brands.push(newBrand);
    return newBrand;
  },

  // PRODUCTS
  getProducts: () => products,
  getProductById: (id: string) => products.find(p => p.id === id),
  getProductBySlug: (slug: string) => products.find(p => p.slug === slug),
  createProduct: (item: Omit<Product, 'id' | 'created_at'>) => {
    const newProduct: Product = {
      ...item,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    products.push(newProduct);
    return newProduct;
  },
  updateProduct: (id: string, updates: Partial<Product>) => {
    products = products.map(p => p.id === id ? { ...p, ...updates } : p);
    return products.find(p => p.id === id);
  },
  deleteProduct: (id: string) => {
    products = products.filter(p => p.id !== id);
    specs = specs.filter(s => s.product_id !== id);
    reviews = reviews.filter(r => r.product_id !== id);
    comparisons = comparisons.filter(c => c.product_a_id !== id && c.product_b_id !== id);
    return true;
  },

  // SPECS
  getSpecsForProduct: (productId: string) => specs.filter(s => s.product_id === productId),
  addSpec: (productId: string, name: string, value: string) => {
    const newSpec = { id: `spec-${Date.now()}`, product_id: productId, spec_name: name, spec_value: value };
    specs.push(newSpec);
    return newSpec;
  },
  clearSpecs: (productId: string) => {
    specs = specs.filter(s => s.product_id !== productId);
  },

  // REVIEWS
  getReviews: () => reviews,
  getReviewByProductId: (productId: string) => reviews.find(r => r.product_id === productId),
  getReviewBySlug: (slug: string) => {
    const product = products.find(p => p.slug === slug);
    if (!product) return undefined;
    return reviews.find(r => r.product_id === product.id);
  },
  createReview: (item: Omit<Review, 'id'>) => {
    const newReview: Review = { ...item, id: `rev-${Date.now()}` };
    // remove existing if any
    reviews = reviews.filter(r => r.product_id !== item.product_id);
    reviews.push(newReview);
    return newReview;
  },
  updateReview: (id: string, updates: Partial<Review>) => {
    reviews = reviews.map(r => r.id === id ? { ...r, ...updates } : r);
    return reviews.find(r => r.id === id);
  },
  deleteReview: (id: string) => {
    reviews = reviews.filter(r => r.id !== id);
    return true;
  },

  // COMPARISONS
  getComparisons: () => comparisons,
  getComparisonBySlug: (slug: string) => comparisons.find(c => c.slug === slug),
  createComparison: (item: Omit<Comparison, 'id' | 'created_at'>) => {
    const newComp: Comparison = {
      ...item,
      id: `comp-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    comparisons.push(newComp);
    return newComp;
  },
  updateComparison: (id: string, updates: Partial<Comparison>) => {
    comparisons = comparisons.map(c => c.id === id ? { ...c, ...updates } : c);
    return comparisons.find(c => c.id === id);
  },
  deleteComparison: (id: string) => {
    comparisons = comparisons.filter(c => c.id !== id);
    return true;
  },

  // ARTICLES
  getArticles: () => articles,
  getArticleBySlug: (slug: string) => articles.find(a => a.slug === slug),
  createArticle: (item: Omit<Article, 'id' | 'published_at' | 'author_name' | 'author_id'>) => {
    const newArticle: Article = {
      ...item,
      id: `art-${Date.now()}`,
      author_id: 'author-mock-1',
      author_name: 'Adriano José',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
      published_at: new Date().toISOString()
    };
    articles.push(newArticle);
    return newArticle;
  },
  updateArticle: (id: string, updates: Partial<Article>) => {
    articles = articles.map(a => a.id === id ? { ...a, ...updates } : a);
    return articles.find(a => a.id === id);
  },
  deleteArticle: (id: string) => {
    articles = articles.filter(a => a.id !== id);
    return true;
  },

  // SETTINGS
  getSettings: () => settings,
  updateSetting: (key: string, value: string) => {
    settings = settings.map(s => s.key === key ? { ...s, value } : s);
    return settings.find(s => s.key === key);
  },

  // NEWSLETTER
  getNewsletterSubscribers: () => newsletterSubscribers,
  addNewsletterSubscriber: (email: string) => {
    if (newsletterSubscribers.some(n => n.email === email)) return false;
    const newSub = { id: `ns-${Date.now()}`, email, created_at: new Date().toISOString() };
    newsletterSubscribers.push(newSub);
    return newSub;
  },

  // PROMPTS
  getPrompts: () => prompts,
  getPromptById: (id: string) => prompts.find(p => p.id === id),
  createPrompt: (item: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>) => {
    const newPrompt: Prompt = {
      ...item,
      id: `pr-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    prompts.push(newPrompt);
    return newPrompt;
  },
  updatePrompt: (id: string, updates: Partial<Prompt>) => {
    prompts = prompts.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p);
    return prompts.find(p => p.id === id);
  },
  deletePrompt: (id: string) => {
    prompts = prompts.filter(p => p.id !== id);
    return true;
  },

  // GENERATIONS
  getGenerations: () => contentGenerations,
  getGenerationsForProduct: (productId: string) => contentGenerations.filter(g => g.product_id === productId),
  createGeneration: (item: Omit<ContentGeneration, 'id' | 'created_at' | 'updated_at'>) => {
    const newGen: ContentGeneration = {
      ...item,
      id: `gen-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    contentGenerations.push(newGen);
    return newGen;
  },
  deleteGeneration: (id: string) => {
    contentGenerations = contentGenerations.filter(g => g.id !== id);
    return true;
  },

  // AI SETTINGS
  getAISettings: () => aiSettings,
  updateAISettings: (updates: Partial<AISettings>) => {
    aiSettings = { ...aiSettings, ...updates };
    return aiSettings;
  }
};

