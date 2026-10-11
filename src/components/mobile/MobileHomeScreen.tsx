'use client';

import React from 'react';
import MobileProfileWidget from './MobileProfileWidget';
import MobileAppGrid from './MobileAppGrid';
import MobileDock from './MobileDock';

export default function MobileHomeScreen() {
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden relative">
      {/* Contenido principal con scroll táctil limpio */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-10 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* Widget Superior de Perfil */}
        <MobileProfileWidget />

        {/* Rejilla de Apps */}
        <section aria-label="Aplicaciones del Sistema">
          <MobileAppGrid />
        </section>
      </div>

      {/* Dock Inferior Fijo */}
      <div className="shrink-0 flex flex-col items-center">
        <MobileDock />
        {/* Home Indicator Pill */}
        <div className="h-4 flex items-center justify-center">
          <div className="w-28 h-1 bg-white/35 rounded-full" />
        </div>
      </div>
    </div>
  );
}
