'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Sparkles, FolderOpen, FileDown, MessageCircle, Code2, Briefcase, User, Award, Terminal, FileText, Music, Lightbulb, Globe, Mail, Settings } from 'lucide-react';
import { AppId, useWindowStore } from '@/store/useWindowStore';
import { useTranslations, useLocale } from 'next-intl';
import { useSystemSounds } from '@/hooks/useSystemSounds';
import { APP_COMPONENTS } from '../windows/WindowManager';

interface MobileAppShellProps {
  appId: AppId;
}

const APP_ICONS: Record<AppId, React.ReactNode> = {
  recruiter: <Sparkles size={16} className="text-emerald-400" />,
  projects: <FolderOpen size={16} className="text-sky-400" />,
  resume: <FileDown size={16} className="text-rose-400" />,
  chat: <MessageCircle size={16} className="text-teal-400" />,
  skills: <Code2 size={16} className="text-cyan-400" />,
  experience: <Briefcase size={16} className="text-amber-400" />,
  about: <User size={16} className="text-purple-400" />,
  certificates: <Award size={16} className="text-yellow-400" />,
  terminal: <Terminal size={16} className="text-emerald-400" />,
  notes: <FileText size={16} className="text-orange-400" />,
  music: <Music size={16} className="text-pink-400" />,
  experiments: <Lightbulb size={16} className="text-violet-400" />,
  browser: <Globe size={16} className="text-sky-400" />,
  contact: <Mail size={16} className="text-blue-400" />,
  settings: <Settings size={16} className="text-slate-400" />,
  files: <FolderOpen size={16} className="text-amber-400" />,
};

export default function MobileAppShell({ appId }: MobileAppShellProps) {
  const t = useTranslations('Dock');
  const locale = useLocale();
  const isEs = locale === 'es';
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const { playClose } = useSystemSounds();

  const handleMinimize = () => {
    playClose();
    minimizeWindow(appId);
  };

  const handleClose = () => {
    playClose();
    closeWindow(appId);
  };

  const AppComponent = APP_COMPONENTS[appId];

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0.8 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="absolute inset-0 z-40 bg-zinc-950/95 flex flex-col overflow-hidden text-white select-none"
    >
      {/* Mobile Top Navigation Bar */}
      <header className="h-12 px-3 border-b border-white/10 bg-zinc-900/90 dark:bg-black/90 backdrop-blur-xl flex items-center justify-between shrink-0 z-30">
        {/* Botón Atrás / Inicio */}
        <button
          onClick={handleMinimize}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold active:scale-95 transition-all"
        >
          <ArrowLeft size={15} />
          <span>{isEs ? 'Inicio' : 'Home'}</span>
        </button>

        {/* Título e Ícono Central de la App */}
        <div className="flex items-center gap-2 max-w-[180px]">
          {APP_ICONS[appId]}
          <span className="text-xs font-bold truncate tracking-tight">
            {t(appId)}
          </span>
        </div>

        {/* Botón de Cierre */}
        <button
          onClick={handleClose}
          aria-label={isEs ? 'Cerrar aplicación' : 'Close app'}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all"
        >
          <X size={15} />
        </button>
      </header>

      {/* Cuerpo de la Aplicación a Pantalla Completa */}
      <main className="flex-1 min-h-0 relative overflow-hidden flex flex-col bg-zinc-950">
        {AppComponent ? (
          <AppComponent />
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
            App not found
          </div>
        )}
      </main>

      {/* Home Indicator Inferior */}
      <footer className="h-5 flex items-center justify-center shrink-0 bg-zinc-950 border-t border-white/5">
        <button
          onClick={handleMinimize}
          title={isEs ? 'Volver a inicio' : 'Return to home'}
          className="w-28 h-1 bg-white/40 hover:bg-white/70 active:bg-white rounded-full transition-colors"
        />
      </footer>
    </motion.div>
  );
}
