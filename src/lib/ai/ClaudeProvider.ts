import { AIProvider, AIResult } from './AIProvider';
import { generateMockContent } from './mockTextGenerator';

export class ClaudeProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
  }

  async generate(prompt: string, model: string, temperature: number, maxTokens: number): Promise<AIResult> {
    const startTime = Date.now();
    
    let productName = 'MacBook Air M3';
    if (prompt.includes('MacBook')) productName = 'MacBook Air M3';
    else if (prompt.includes('XPS')) productName = 'Dell XPS 13';
    else if (prompt.includes('S24')) productName = 'Samsung Galaxy S24 Ultra';
    else if (prompt.includes('Kingston')) productName = 'SSD Kingston KC3000';
    else if (prompt.includes('MX Master')) productName = 'Logitech MX Master 3S';

    let contentType = 'review';
    if (prompt.toLowerCase().includes('faq')) contentType = 'faq';
    else if (prompt.toLowerCase().includes('guia')) contentType = 'guia';
    else if (prompt.toLowerCase().includes('seo') || prompt.toLowerCase().includes('meta')) contentType = 'seo';
    else if (prompt.toLowerCase().includes('linkedin')) contentType = 'linkedin';
    else if (prompt.toLowerCase().includes('shorts') || prompt.toLowerCase().includes('youtube')) contentType = 'shorts';

    if (this.apiKey && !this.apiKey.startsWith('sk-mock') && !this.apiKey.startsWith('claude-mock')) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: model || 'claude-3-5-sonnet-20241022',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
            temperature: temperature
          })
        });
        const data = await response.json();
        const text = data.content[0].text;
        const tokensInput = data.usage.input_tokens;
        const tokensOutput = data.usage.output_tokens;

        return {
          text,
          tokensInput,
          tokensOutput,
          estimatedCost: (tokensInput * 0.000003) + (tokensOutput * 0.000015),
          executionTime: Date.now() - startTime
        };
      } catch (err) {
        console.warn('Claude API call failed, falling back to simulation:', err);
      }
    }

    const mockText = generateMockContent(contentType, productName);
    const tokensInput = Math.round(prompt.length / 4);
    const tokensOutput = Math.round(mockText.length / 4);
    
    await new Promise(resolve => setTimeout(resolve, 950)); // Claude is thorough

    return {
      text: mockText,
      tokensInput,
      tokensOutput,
      estimatedCost: (tokensInput * 0.000003) + (tokensOutput * 0.000015),
      executionTime: Date.now() - startTime
    };
  }
}
