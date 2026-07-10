import { useState, useEffect } from 'react';
import { AISettings } from '@/lib/seedData';

export function useAISettings() {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching AI settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AISettings) => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      setSettings(data);
      return data;
    } catch (err) {
      console.error('Error saving AI settings:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { settings, loading, saving, fetchSettings, saveSettings };
}
