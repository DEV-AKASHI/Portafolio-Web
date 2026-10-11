'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindowStore } from '@/store/useWindowStore';
import MobileStatusBar from './MobileStatusBar';
import MobileHomeScreen from './MobileHomeScreen';
import MobileAppShell from './MobileAppShell';

export default function MobileOS() {
  const activeWindow = useWindowStore((state) => state.activeWindow);
  const windows = useWindowStore((state) => state.windows);

  const activeApp = activeWindow && windows[activeWindow]?.isOpen && !windows[activeWindow]?.isMinimized
    ? activeWindow
    : null;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-transparent select-none">
      {/* Barra de Estado Móvil Superior */}
      <MobileStatusBar />

      {/* Contenido: Home Screen o App Activa */}
      <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
        <MobileHomeScreen />

        <AnimatePresence>
          {activeApp && (
            <MobileAppShell key={activeApp} appId={activeApp} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
