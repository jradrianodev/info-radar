import { AIProvider, AIResult } from './AIProvider';
import { generateMockContent } from './mockTextGenerator';

export class DeepSeekProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY || '';
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

    if (this.apiKey && !this.apiKey.startsWith('sk-mock') && !this.apiKey.startsWith('deepseek-mock')) {
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: model || 'deepseek-chat',
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
          estimatedCost: (tokensInput * 0.00000014) + (tokensOutput * 0.00000028), // Deepseek is extremely cheap
          executionTime: Date.now() - startTime
        };
      } catch (err) {
        console.warn('DeepSeek API call failed, falling back to simulation:', err);
      }
    }

    const mockText = generateMockContent(contentType, productName);
    const tokensInput = Math.round(prompt.length / 4);
    const tokensOutput = Math.round(mockText.length / 4);
    
    await new Promise(resolve => setTimeout(resolve, 1100)); // DeepSeek can have slight queue delay

    return {
      text: mockText,
      tokensInput,
      tokensOutput,
      estimatedCost: (tokensInput * 0.00000014) + (tokensOutput * 0.00000028),
      executionTime: Date.now() - startTime
    };
  }
}
