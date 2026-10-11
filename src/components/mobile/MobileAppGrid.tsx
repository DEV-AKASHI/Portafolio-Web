'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  FolderOpen,
  Briefcase,
  User,
  Code2,
  MessageCircle,
  Award,
  FileText,
  Globe,
  Lightbulb,
  Mail,
  Terminal,
  Settings,
  Music,
  FileDown,
  Sparkles,
} from 'lucide-react';
import { AppId, useWindowStore } from '@/store/useWindowStore';
import { useSystemSounds } from '@/hooks/useSystemSounds';

interface MobileAppItem {
  id: AppId;
  labelKey: string;
  icon: React.ReactNode;
  iconBg: string;
  badge?: string;
}

export default function MobileAppGrid() {
  const t = useTranslations('Dock');
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);
  const { playClick } = useSystemSounds();

  const apps: MobileAppItem[] = [
    {
      id: 'recruiter',
      labelKey: 'recruiter',
      badge: 'VIP',
      icon: <Sparkles className="w-6 h-6 text-emerald-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-emerald-500/30 to-teal-700/40 border-emerald-400/40 shadow-[0_6px_14px_-2px_rgba(16,185,129,0.35)]',
    },
    {
      id: 'projects',
      labelKey: 'projects',
      icon: <FolderOpen className="w-6 h-6 text-sky-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-sky-500/30 to-blue-700/40 border-sky-400/40 shadow-[0_6px_14px_-2px_rgba(14,165,233,0.35)]',
    },
    {
      id: 'resume',
      labelKey: 'resume',
      badge: 'PDF',
      icon: <FileDown className="w-6 h-6 text-rose-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-rose-500/30 to-red-700/40 border-rose-400/40 shadow-[0_6px_14px_-2px_rgba(244,63,94,0.35)]',
    },
    {
      id: 'chat',
      labelKey: 'chat',
      icon: <MessageCircle className="w-6 h-6 text-teal-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-teal-500/30 to-emerald-700/40 border-teal-400/40 shadow-[0_6px_14px_-2px_rgba(20,184,166,0.35)]',
    },
    {
      id: 'skills',
      labelKey: 'skills',
      icon: <Code2 className="w-6 h-6 text-cyan-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-cyan-500/30 to-blue-700/40 border-cyan-400/40 shadow-[0_6px_14px_-2px_rgba(6,182,212,0.35)]',
    },
    {
      id: 'experience',
      labelKey: 'experience',
      icon: <Briefcase className="w-6 h-6 text-amber-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-amber-500/30 to-orange-700/40 border-amber-400/40 shadow-[0_6px_14px_-2px_rgba(245,158,11,0.35)]',
    },
    {
      id: 'about',
      labelKey: 'about',
      icon: <User className="w-6 h-6 text-purple-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-purple-500/30 to-indigo-700/40 border-purple-400/40 shadow-[0_6px_14px_-2px_rgba(168,85,247,0.35)]',
    },
    {
      id: 'certificates',
      labelKey: 'certificates',
      icon: <Award className="w-6 h-6 text-yellow-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-yellow-500/30 to-amber-700/40 border-yellow-400/40 shadow-[0_6px_14px_-2px_rgba(234,179,8,0.35)]',
    },
    {
      id: 'terminal',
      labelKey: 'terminal',
      icon: <Terminal className="w-6 h-6 text-emerald-400" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-zinc-800 to-zinc-950 border-zinc-700/60 shadow-[0_6px_14px_-2px_rgba(0,0,0,0.5)]',
    },
    {
      id: 'notes',
      labelKey: 'notes',
      icon: <FileText className="w-6 h-6 text-orange-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-orange-500/30 to-amber-700/40 border-orange-400/40 shadow-[0_6px_14px_-2px_rgba(249,115,22,0.35)]',
    },
    {
      id: 'music',
      labelKey: 'music',
      icon: <Music className="w-6 h-6 text-pink-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-pink-500/30 to-rose-700/40 border-pink-400/40 shadow-[0_6px_14px_-2px_rgba(236,72,153,0.35)]',
    },
    {
      id: 'experiments',
      labelKey: 'experiments',
      icon: <Lightbulb className="w-6 h-6 text-violet-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-violet-500/30 to-purple-700/40 border-violet-400/40 shadow-[0_6px_14px_-2px_rgba(139,92,246,0.35)]',
    },
    {
      id: 'browser',
      labelKey: 'browser',
      icon: <Globe className="w-6 h-6 text-sky-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-sky-500/30 to-teal-700/40 border-sky-400/40 shadow-[0_6px_14px_-2px_rgba(14,165,233,0.35)]',
    },
    {
      id: 'contact',
      labelKey: 'contact',
      icon: <Mail className="w-6 h-6 text-blue-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-blue-500/30 to-indigo-700/40 border-blue-400/40 shadow-[0_6px_14px_-2px_rgba(59,130,246,0.35)]',
    },
    {
      id: 'settings',
      labelKey: 'settings',
      icon: <Settings className="w-6 h-6 text-slate-300" strokeWidth={1.8} />,
      iconBg: 'bg-gradient-to-br from-slate-600/30 to-zinc-800/50 border-slate-500/40 shadow-[0_6px_14px_-2px_rgba(71,85,105,0.35)]',
    },
  ];

  const handleAppClick = (appId: AppId) => {
    playClick();
    openWindow(appId);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-y-4 gap-x-2.5 justify-items-center">
        {apps.map((app, index) => {
          const isOpen = windows[app.id]?.isOpen;
          return (
            <motion.button
              key={app.id}
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              onClick={() => handleAppClick(app.id)}
              whileTap={{ scale: 0.88 }}
              className="flex flex-col items-center justify-center w-[72px] outline-none group"
            >
              {/* Contenedor del Icono Móvil */}
              <div
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border backdrop-blur-md transition-all duration-200 group-hover:scale-105 ${app.iconBg}`}
              >
                {app.icon}

                {/* Badge opcional */}
                {app.badge && (
                  <span className="absolute -top-1 -right-1 text-[8.5px] font-black tracking-tight bg-rose-600 text-white px-1.5 py-0.2 rounded-md shadow-sm border border-rose-400/50">
                    {app.badge}
                  </span>
                )}

                {/* Punto activo en segundo plano */}
                {isOpen && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_1px_rgba(255,255,255,0.9)] animate-pulse" />
                )}
              </div>

              {/* Etiqueta de la aplicación */}
              <span
                className="mt-1.5 text-[11px] font-medium leading-tight text-white/95 text-center truncate max-w-[68px] tracking-tight"
                style={{
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.8)',
                }}
              >
                {t(app.labelKey)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
