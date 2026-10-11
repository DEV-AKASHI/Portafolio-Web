'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryCharging, BatteryFull, BatteryMedium, BatteryLow, BatteryWarning, Sparkles } from 'lucide-react';
import { useBattery } from '@/hooks/useBattery';
import LanguageSwitcher from '../desktop/LanguageSwitcher';
import ThemeToggle from '../desktop/ThemeToggle';
import { useWindowStore } from '@/store/useWindowStore';
import { useTranslations } from 'next-intl';

export default function MobileStatusBar() {
  const [time, setTime] = useState(() => new Date());
  const [isMounted, setIsMounted] = useState(false);
  const { level, charging } = useBattery();
  const batteryPercentage = Math.round(level * 100);
  const openWindow = useWindowStore((state) => state.openWindow);
  const tTopBar = useTranslations('TopBar');

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = isMounted 
    ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '';

  const renderBatteryIcon = () => {
    if (charging) return <BatteryCharging size={13} className="text-emerald-400" />;
    if (batteryPercentage >= 90) return <BatteryFull size={13} />;
    if (batteryPercentage >= 50) return <BatteryMedium size={13} />;
    if (batteryPercentage >= 20) return <BatteryLow size={13} />;
    return <BatteryWarning size={13} className="text-red-400" />;
  };

  return (
    <header className="h-10 px-3.5 flex items-center justify-between text-xs font-semibold text-white/90 select-none z-50 backdrop-blur-xl bg-black/30 border-b border-white/10 shrink-0">
      {/* Reloj Móvil */}
      <div className="flex items-center gap-2">
        <span className="font-bold tracking-tight text-[13px]">{timeString}</span>
        <button
          onClick={() => openWindow('recruiter')}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold active:scale-95 transition-transform"
        >
          <Sparkles size={10} className="text-emerald-400 animate-pulse" />
          <span>VIP</span>
        </button>
      </div>

      {/* Notch / Dynamic Island decorativo */}
      <div className="w-16 h-4 bg-black/60 border border-white/10 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-ping mr-1" />
        <span className="text-[9px] font-mono text-white/70">OS</span>
      </div>

      {/* Controles de Estado y Sistema */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 opacity-80 text-[11px]">
          <Wifi size={13} />
          <span className="text-[10px] font-bold">5G</span>
          <div className="flex items-center gap-0.5">
            {renderBatteryIcon()}
            <span className="text-[10px]">{batteryPercentage}%</span>
          </div>
        </div>

        <div className="h-3.5 w-px bg-white/20 mx-0.5" />

        {/* Idioma y Tema compactos */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
