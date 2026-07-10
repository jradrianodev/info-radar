import { useState, useEffect } from 'react';
import { ContentGeneration } from '@/lib/seedData';

export function useGenerationHistory(productId?: string) {
  const [history, setHistory] = useState<ContentGeneration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [productId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      
      if (productId) {
        setHistory(data.filter((g: any) => g.product_id === productId));
      } else {
        setHistory(data);
      }
    } catch (err) {
      console.error('Error fetching generation history:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/history?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting history item:', err);
      return false;
    }
  };

  return { history, loading, fetchHistory, deleteHistoryItem };
}
