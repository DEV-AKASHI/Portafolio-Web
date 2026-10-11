'use client';

import { useEffect } from 'react';
import { useWindowStore, AppId } from '@/store/useWindowStore';
import { useSpotlightStore } from '@/store/useSpotlightStore';

export function useKeyboardShortcuts() {
  const { openWindow, activeWindow, closeWindow, minimizeWindow, focusWindow, windows } = useWindowStore();
  const { toggleSpotlight, isOpen: isSpotlightOpen, closeSpotlight } = useSpotlightStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar en móviles para no interferir con el teclado táctil
      if (typeof window !== 'undefined' && window.innerWidth < 768) return;

      // Ignorar atajos si el usuario está escribiendo en un input o textarea
      const target = e.target as HTMLElement | null;
      const isTyping = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      // Spotlight (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSpotlight();
        return;
      }

      // Si está escribiendo, no interceptar ninguna otra tecla
      if (isTyping) return;

      // Ctrl+T or Cmd+T -> Abrir Terminal
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        openWindow('terminal');
        return;
      }

      // Escape -> Cerrar Spotlight o minimizar ventana activa
      if (e.key === 'Escape') {
        if (isSpotlightOpen) {
          e.preventDefault();
          closeSpotlight();
          return;
        }
        if (activeWindow) {
          e.preventDefault();
          minimizeWindow(activeWindow);
          return;
        }
      }

      // Alt+W or Cmd+W -> Cerrar ventana activa
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'w' && activeWindow) {
        e.preventDefault();
        closeWindow(activeWindow);
        return;
      }

      // Alt+Tab o Ctrl+Tab -> Alternar entre ventanas abiertas
      if ((e.altKey || e.ctrlKey) && e.key.toLowerCase() === 'tab') {
        e.preventDefault();
        const openAppIds = (Object.keys(windows) as AppId[]).filter(
          (id) => windows[id].isOpen && !windows[id].isMinimized
        );
        if (openAppIds.length > 1) {
          const currentIndex = activeWindow ? openAppIds.indexOf(activeWindow) : -1;
          const nextIndex = (currentIndex + 1) % openAppIds.length;
          focusWindow(openAppIds[nextIndex]);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openWindow, activeWindow, closeWindow, minimizeWindow, focusWindow, windows, toggleSpotlight, isSpotlightOpen, closeSpotlight]);
}
