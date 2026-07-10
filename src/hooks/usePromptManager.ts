import { useState, useEffect } from 'react';
import { Prompt } from '@/lib/seedData';

export function usePromptManager() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/prompts');
      const data = await res.json();
      setPrompts(data);
    } catch (err) {
      console.error('Error fetching prompts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPrompt = async (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      });
      const data = await res.json();
      fetchPrompts();
      return data;
    } catch (err) {
      console.error('Error creating prompt:', err);
      throw err;
    }
  };

  const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      fetchPrompts();
      return data;
    } catch (err) {
      console.error('Error updating prompt:', err);
      throw err;
    }
  };

  const deletePrompt = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      fetchPrompts();
      return data.success;
    } catch (err) {
      console.error('Error deleting prompt:', err);
      throw err;
    }
  };

  return { prompts, loading, fetchPrompts, createPrompt, updatePrompt, deletePrompt };
}
