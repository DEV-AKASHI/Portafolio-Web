'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FolderOpen, FileDown, MessageCircle } from 'lucide-react';
import { AppId, useWindowStore } from '@/store/useWindowStore';
import { useSystemSounds } from '@/hooks/useSystemSounds';

export default function MobileDock() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);
  const { playClick } = useSystemSounds();

  const dockApps: { id: AppId; icon: React.ReactNode; bg: string; badge?: string }[] = [
    {
      id: 'recruiter',
      badge: 'VIP',
      icon: <Sparkles className="w-6 h-6 text-emerald-300" strokeWidth={1.8} />,
      bg: 'bg-gradient-to-br from-emerald-500/35 to-teal-700/45 border-emerald-400/40 shadow-[0_4px_12px_rgba(16,185,129,0.3)]',
    },
    {
      id: 'projects',
      icon: <FolderOpen className="w-6 h-6 text-sky-300" strokeWidth={1.8} />,
      bg: 'bg-gradient-to-br from-sky-500/35 to-blue-700/45 border-sky-400/40 shadow-[0_4px_12px_rgba(14,165,233,0.3)]',
    },
    {
      id: 'resume',
      badge: 'PDF',
      icon: <FileDown className="w-6 h-6 text-rose-300" strokeWidth={1.8} />,
      bg: 'bg-gradient-to-br from-rose-500/35 to-red-700/45 border-rose-400/40 shadow-[0_4px_12px_rgba(244,63,94,0.3)]',
    },
    {
      id: 'chat',
      icon: <MessageCircle className="w-6 h-6 text-teal-300" strokeWidth={1.8} />,
      bg: 'bg-gradient-to-br from-teal-500/35 to-emerald-700/45 border-teal-400/40 shadow-[0_4px_12px_rgba(20,184,166,0.3)]',
    },
  ];

  const handleDockClick = (id: AppId) => {
    playClick();
    openWindow(id);
  };

  return (
    <nav 
      aria-label="Mobile Navigation Dock"
      className="w-full px-4 pt-2 pb-1"
    >
      <div className="w-full max-w-sm mx-auto p-2.5 rounded-3xl bg-zinc-900/60 dark:bg-black/60 backdrop-blur-2xl border border-white/15 shadow-2xl flex items-center justify-around">
        {dockApps.map((app) => {
          const isOpen = windows[app.id]?.isOpen;
          return (
            <motion.button
              key={app.id}
              onClick={() => handleDockClick(app.id)}
              whileTap={{ scale: 0.85 }}
              className={`relative w-13 h-13 rounded-2xl flex items-center justify-center border backdrop-blur-lg ${app.bg}`}
              aria-label={app.id}
            >
              {app.icon}

              {/* Badge opcional */}
              {app.badge && (
                <span className="absolute -top-1 -right-1 text-[8px] font-black tracking-tight bg-rose-600 text-white px-1 rounded shadow-sm border border-rose-400/50">
                  {app.badge}
                </span>
              )}

              {/* Indicador de app en ejecución */}
              {isOpen && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_1px_rgba(255,255,255,0.9)] animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
