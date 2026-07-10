export interface AIResult {
  text: string;
  tokensInput: number;
  tokensOutput: number;
  estimatedCost: number;
  executionTime: number;
}

export interface AIProvider {
  generate(prompt: string, model: string, temperature: number, maxTokens: number): Promise<AIResult>;
}
