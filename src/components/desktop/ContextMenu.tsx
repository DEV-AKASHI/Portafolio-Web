'use client';

import React, { useEffect, useRef } from 'react';
import { useContextMenuStore } from '@/store/useContextMenuStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useWindowStore } from '@/store/useWindowStore';
import { useSystemSounds } from '@/hooks/useSystemSounds';
import { Code2, Monitor, SunMoon, Terminal, FolderGit2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContextMenu() {
  const { isOpen, x, y, closeMenu } = useContextMenuStore();
  const { toggleTheme, theme } = useThemeStore();
  const openWindow = useWindowStore((state) => state.openWindow);
  const { playClick } = useSystemSounds();
  const isDark = theme === 'dark';
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (isOpen) closeMenu();
    };
    
    // Listen for click anywhere to close
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isOpen, closeMenu]);

  if (!isOpen) return null;

  // Make sure the menu doesn't go off-screen
  let posX = x;
  let posY = y;
  
  const menuWidth = 230;
  const menuHeight = 280;
  
  if (typeof window !== 'undefined') {
    if (x + menuWidth > window.innerWidth) posX = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) posY = window.innerHeight - menuHeight - 10;
  }

  const handleAction = (action: string) => {
    playClick();
    switch (action) {
      case 'recruiter':
        openWindow('recruiter');
        break;
      case 'theme':
        toggleTheme();
        break;
      case 'wallpaper':
        openWindow('settings');
        break;
      case 'terminal':
        openWindow('terminal');
        break;
      case 'projects':
        openWindow('projects');
        break;
      case 'github':
        window.open('https://github.com/DEV-AKASHI/Portafolio-Web', '_blank');
        break;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        style={{ top: posY, left: posX }}
        className="fixed z-[99999] w-60 bg-white/95 dark:bg-black/92 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-1.5 text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider mb-1">
          Opciones del Sistema
        </div>
        
        <button 
          onClick={() => { handleAction('wallpaper'); closeMenu(); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Monitor size={16} className="text-sky-500" />
          <span>Personalizar Fondo</span>
        </button>

        <button 
          onClick={() => { handleAction('recruiter'); closeMenu(); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-500/10 transition-colors"
        >
          <Sparkles size={16} className="text-emerald-500 animate-pulse" />
          <span>Modo Reclutador (Fast Track)</span>
        </button>

        <button 
          onClick={() => { handleAction('projects'); closeMenu(); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <FolderGit2 size={16} className="text-amber-500" />
          <span>Explorar Proyectos</span>
        </button>

        <button 
          onClick={() => { handleAction('terminal'); closeMenu(); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Terminal size={16} className="text-emerald-500" />
          <span>Abrir Terminal</span>
        </button>

        <button 
          onClick={() => { handleAction('theme'); closeMenu(); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <SunMoon size={16} className="text-purple-500" />
          <span>Alternar Modo ({isDark ? 'Claro' : 'Oscuro'})</span>
        </button>
        
        <div className="h-px bg-black/10 dark:bg-white/10 my-1.5 mx-2" />

        <button 
          onClick={() => { handleAction('github'); closeMenu(); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Code2 size={16} className="text-black/70 dark:text-white/70" />
          <span>Ver código fuente</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
