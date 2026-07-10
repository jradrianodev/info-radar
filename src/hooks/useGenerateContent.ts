import { useState } from 'react';
import confetti from 'canvas-confetti';

export function useGenerateContent() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generate = async (productId: string, types: string[]) => {
    setGenerating(true);
    setProgress(10);
    setError(null);

    // Simulate progress increments for UI/UX visual feedback
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 85) return p;
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 180);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, types })
      });
      
      const data = await res.json();
      
      clearInterval(interval);
      
      if (res.ok && data.success) {
        setProgress(100);
        
        // Explode confetti on completion
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        
        return data.results;
      } else {
        throw new Error(data.error || 'Erro na geração por IA');
      }
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'Erro de conexão');
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  return { generate, generating, progress, error, setProgress };
}
