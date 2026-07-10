import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { ProviderFactory } from '@/lib/ai/ProviderFactory';

export async function POST(request: Request) {
  try {
    const { productId, types } = await request.json();

    if (!productId || !types || !Array.isArray(types) || types.length === 0) {
      return NextResponse.json({ error: 'Missing productId or types array' }, { status: 400 });
    }

    const product = await dbService.getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const settings = await dbService.getAISettings();
    const prompts = await dbService.getPrompts();

    const provider = ProviderFactory.create(settings.provider, settings.api_key);
    const results = [];

    for (const type of types) {
      // 1. Locate active prompt template for the category
      const activePrompt = prompts.find(p => p.category === type && p.active) || prompts[0];
      
      // 2. Interpolate template tags
      const interpolatedPrompt = activePrompt.prompt
        .replace('{product_name}', product.name)
        .replace('{product_description}', product.description);

      // 3. Fire strategic provider generate
      const aiResult = await provider.generate(
        interpolatedPrompt,
        activePrompt.model || settings.model,
        activePrompt.temperature || settings.temperature,
        settings.max_tokens
      );

      // 4. Save corresponding draft records based on type
      let draftId = '';

      if (type === 'review') {
        // Create draft review
        const mockReview = {
          product_id: product.id,
          rating: 8.5,
          pros: ['Desempenho otimizado', 'Design durável'],
          contras: ['Preço inicial elevado'],
          summary: aiResult.text.substring(0, 200),
          conclusion: 'Veredito final gerado por IA.',
          specs_table: { 'Processamento': 'IA Otimizado' },
          gallery: []
        };
        const savedReview = await dbService.createReview(mockReview);
        draftId = savedReview.id;
      } else if (type === 'guia' || type === 'faq') {
        // Create draft article
        const mockArticle = {
          title: `${type === 'faq' ? 'FAQ' : 'Guia de Compra'}: ${product.name}`,
          slug: `${product.slug}-${type}-${Date.now().toString().slice(-4)}`,
          summary: `Conteúdo de ${type} gerado automaticamente para o ${product.name}.`,
          content: aiResult.text,
          image_url: product.image_url,
          category_id: product.category_id,
          read_time: 5,
          status: 'draft' as const
        };
        const savedArt = await dbService.createArticle(mockArticle);
        draftId = savedArt.id;
      }

      // 5. Log generation history row
      const savedGen = await dbService.createGeneration({
        product_id: product.id,
        provider: settings.provider,
        model: activePrompt.model || settings.model,
        prompt_id: activePrompt.id,
        content_type: type,
        request: interpolatedPrompt,
        response: aiResult.text,
        draft_id: draftId,
        status: 'draft',
        tokens_input: aiResult.tokensInput,
        tokens_output: aiResult.tokensOutput,
        estimated_cost: aiResult.estimatedCost,
        execution_time: aiResult.executionTime
      });

      results.push(savedGen);
    }

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error('AI Generation Handler Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
