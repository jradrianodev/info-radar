import { AIProvider } from './AIProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { GeminiProvider } from './GeminiProvider';
import { ClaudeProvider } from './ClaudeProvider';
import { DeepSeekProvider } from './DeepSeekProvider';

export class ProviderFactory {
  static create(providerName: string, apiKey?: string): AIProvider {
    switch (providerName.toLowerCase()) {
      case 'openai':
        return new OpenAIProvider(apiKey);
      case 'claude':
      case 'anthropic':
        return new ClaudeProvider(apiKey);
      case 'deepseek':
        return new DeepSeekProvider(apiKey);
      case 'gemini':
      case 'google':
      default:
        return new GeminiProvider(apiKey);
    }
  }
}
