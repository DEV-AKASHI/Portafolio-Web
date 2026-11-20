'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { MapPin, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSystemSounds } from '@/hooks/useSystemSounds';
import { useWindowStore } from '@/store/useWindowStore';

export default function MobileProfileWidget() {
  const locale = useLocale();
  const isEs = locale === 'es';
  const [time, setTime] = useState<string>('');
  const { playClick } = useSystemSounds();
  const openWindow = useWindowStore((state) => state.openWindow);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString(isEs ? 'es-MX' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isEs]);

  const handleOpenRecruiter = () => {
    playClick();
    openWindow('recruiter');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-3xl bg-zinc-900/60 dark:bg-black/50 backdrop-blur-2xl border border-white/15 p-4 shadow-2xl text-white space-y-3.5 select-none"
    >
      {/* Cabecera del Widget: Avatar + Info + Estado */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-lg bg-zinc-800">
              <img
                src="/PERFIL.png"
                alt="Jhonatan Jimenez"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 42%' }}
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-zinc-950 animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold tracking-tight text-white truncate">
                Jhonatan Jimenez
              </h2>
              <ShieldCheck size={14} className="text-sky-400 shrink-0" />
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold truncate">
              Flutter & Full Stack Dev
            </p>
            <p className="text-[10px] text-zinc-400 font-mono">
              @DEV-AKASHI
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shrink-0 shadow-sm">
          {isEs ? 'Disponible' : 'Available'}
        </span>
      </div>

      {/* Fila de Metadatos: Ubicación y Hora */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] text-zinc-300">
        <div className="flex items-center gap-1.5 bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/5">
          <MapPin size={13} className="text-rose-400 shrink-0" />
          <span className="truncate font-medium text-white/90">Tabasco, MX</span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/5">
          <Clock size={13} className="text-sky-400 shrink-0" />
          <span className="truncate font-medium text-white/90">{time || 'CST'}</span>
        </div>
      </div>

      {/* Botón de Acción Directo: Modo Reclutador */}
      <button
        onClick={handleOpenRecruiter}
        className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500/25 via-teal-500/25 to-blue-500/25 hover:from-emerald-500/35 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md group"
      >
        <Sparkles size={14} className="text-emerald-400 animate-pulse" />
        <span>{isEs ? 'Abrir Modo Reclutador (Fast Track)' : 'Open Recruiter Mode (Fast Track)'}</span>
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  );
}
