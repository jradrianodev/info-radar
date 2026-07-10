import { AIProvider, AIResult } from './AIProvider';
import { generateMockContent } from './mockTextGenerator';

export class GeminiProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
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

    if (this.apiKey && !this.apiKey.startsWith('sk-mock') && !this.apiKey.startsWith('gemini-mock')) {
      try {
        const geminiModel = model || 'gemini-1.5-pro';
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: temperature,
              maxOutputTokens: maxTokens
            }
          })
        });
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // Gemini pricing is lower or free tier
        const tokensInput = Math.round(prompt.length / 4);
        const tokensOutput = Math.round(text.length / 4);

        return {
          text,
          tokensInput,
          tokensOutput,
          estimatedCost: (tokensInput * 0.00000125) + (tokensOutput * 0.00000375),
          executionTime: Date.now() - startTime
        };
      } catch (err) {
        console.warn('Gemini API call failed, falling back to simulation:', err);
      }
    }

    const mockText = generateMockContent(contentType, productName);
    const tokensInput = Math.round(prompt.length / 4);
    const tokensOutput = Math.round(mockText.length / 4);
    
    await new Promise(resolve => setTimeout(resolve, 600)); // Gemini is usually faster

    return {
      text: mockText,
      tokensInput,
      tokensOutput,
      estimatedCost: (tokensInput * 0.00000125) + (tokensOutput * 0.00000375),
      executionTime: Date.now() - startTime
    };
  }
}
