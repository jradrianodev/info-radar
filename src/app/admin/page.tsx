'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-xs text-slate-400 font-semibold bg-brand-dark">
      <Loader2 className="h-7 w-7 animate-spin text-brand-blue" />
      <span>Carregando painel de administração...</span>
    </div>
  );
}
