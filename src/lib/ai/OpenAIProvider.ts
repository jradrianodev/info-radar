import { AIProvider, AIResult } from './AIProvider';
import { generateMockContent } from './mockTextGenerator';

export class OpenAIProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  async generate(prompt: string, model: string, temperature: number, maxTokens: number): Promise<AIResult> {
    const startTime = Date.now();
    
    // Extract product name from prompt if possible
    let productName = 'MacBook Air M3';
    if (prompt.includes('MacBook')) productName = 'MacBook Air M3';
    else if (prompt.includes('XPS')) productName = 'Dell XPS 13';
    else if (prompt.includes('S24')) productName = 'Samsung Galaxy S24 Ultra';
    else if (prompt.includes('Kingston')) productName = 'SSD Kingston KC3000';
    else if (prompt.includes('MX Master')) productName = 'Logitech MX Master 3S';

    // Infer content type
    let contentType = 'review';
    if (prompt.toLowerCase().includes('faq')) contentType = 'faq';
    else if (prompt.toLowerCase().includes('guia')) contentType = 'guia';
    else if (prompt.toLowerCase().includes('seo') || prompt.toLowerCase().includes('meta')) contentType = 'seo';
    else if (prompt.toLowerCase().includes('linkedin')) contentType = 'linkedin';
    else if (prompt.toLowerCase().includes('shorts') || prompt.toLowerCase().includes('youtube')) contentType = 'shorts';

    // If key exists, we could fetch, otherwise mock
    if (this.apiKey && !this.apiKey.startsWith('sk-mock')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: model || 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: temperature,
            max_tokens: maxTokens
          })
        });
        const data = await response.json();
        const text = data.choices[0].message.content;
        const tokensInput = data.usage.prompt_tokens;
        const tokensOutput = data.usage.completion_tokens;
        
        return {
          text,
          tokensInput,
          tokensOutput,
          estimatedCost: (tokensInput * 0.000005) + (tokensOutput * 0.000015),
          executionTime: Date.now() - startTime
        };
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to simulation:', err);
      }
    }

    // Mock Simulation
    const mockText = generateMockContent(contentType, productName);
    const tokensInput = Math.round(prompt.length / 4);
    const tokensOutput = Math.round(mockText.length / 4);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      text: mockText,
      tokensInput,
      tokensOutput,
      estimatedCost: (tokensInput * 0.000005) + (tokensOutput * 0.000015),
      executionTime: Date.now() - startTime
    };
  }
}
