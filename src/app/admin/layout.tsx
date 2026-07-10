'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Tag, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  GitCompare, 
  Mail, 
  LogOut, 
  User, 
  Settings, 
  Image as ImageIcon,
  ShieldAlert,
  Loader2,
  Sparkles
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setAuthorized(true);
        } else {
          router.push('/admin/login');
        }
      } else {
        const localSession = localStorage.getItem('info-radar-admin-session');
        if (localSession === 'true') {
          setAuthorized(true);
        } else {
          router.push('/admin/login');
        }
      }
      setChecking(false);
    };
    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('info-radar-admin-session');
    }
    router.push('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: 'Categorias', href: '/admin/categorias', icon: <Tag className="h-4 w-4" /> },
    { name: 'Produtos', href: '/admin/produtos', icon: <ShoppingBag className="h-4 w-4" /> },
    { name: 'Reviews', href: '/admin/reviews', icon: <MessageSquare className="h-4 w-4" /> },
    { name: 'Comparativos', href: '/admin/comparativos', icon: <GitCompare className="h-4 w-4" /> },
    { name: 'Artigos', href: '/admin/artigos', icon: <FileText className="h-4 w-4" /> },
    { name: 'Content Studio (AI)', href: '/admin/studio', icon: <Sparkles className="h-4 w-4 text-indigo-400" /> },
    { name: 'Mídia / Uploads', href: '/admin/midia', icon: <ImageIcon className="h-4 w-4" /> },
    { name: 'Newsletter', href: '/admin/newsletter', icon: <Mail className="h-4 w-4" /> },
  ];

  if (checking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="h-8 w-8 text-brand-blue animate-spin" />
        <span className="text-xs text-slate-400 font-semibold">Verificando credenciais...</span>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-screen">
      
      {/* Sidebar Col */}
      <aside className="md:col-span-3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark-card p-6 flex flex-col justify-between">
        
        {/* Navigation list */}
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">SuperAdmin</span>
            <span className="text-xs font-semibold text-slate-400">Painel</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  pathname === item.href 
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User logout section */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs uppercase">A</div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Administrador</span>
              <span className="text-[10px] text-slate-500 block">admin@inforadar.com.br</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair do Painel</span>
          </button>
        </div>

      </aside>

      {/* Main Panel Content Area */}
      <main className="md:col-span-9 p-6 md:p-10 bg-slate-50/50 dark:bg-brand-dark/50 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
