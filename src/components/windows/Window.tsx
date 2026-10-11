'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, TargetAndTransition, useDragControls } from 'framer-motion';
import { AppId, useWindowStore } from '@/store/useWindowStore';
import { X, Minus, Square } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSystemSounds } from '@/hooks/useSystemSounds';
import { useMobileDetect } from '@/hooks/useMobileDetect';

interface WindowProps {
  id: AppId;
  children: React.ReactNode;
}

export default function Window({ id, children }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const winState = useWindowStore((state) => state.windows[id]);
  const activeWindow = useWindowStore((state) => state.activeWindow);
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowStore();
  const t = useTranslations('Dock');
  const isMobile = useMobileDetect();
  const { playOpen, playClose, playSnap } = useSystemSounds();

  const dragControls = useDragControls();
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState({ width: winState?.width || 800, height: winState?.height || 480 });
  const [isResizing, setIsResizing] = useState(false);
  const [snapState, setSnapState] = useState<'none' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('none');
  const [snapPreview, setSnapPreview] = useState<'none' | 'left' | 'right' | 'maximize' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('none');
  const [hasPlayedOpen, setHasPlayedOpen] = useState(false);
  const [viewport, setViewport] = useState({ width: 1280, height: 800 });

  const isActive = activeWindow === id;
  const isMaximized = winState?.isMaximized || isMobile;

  useEffect(() => {
    setMounted(true);
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Sincronizar dimensiones si cambian en el store
  useEffect(() => {
    if (winState?.width && winState?.height && !isResizing) {
      setSize({ width: winState.width, height: winState.height });
    }
  }, [winState?.width, winState?.height, isResizing]);

  useEffect(() => {
    if (winState?.isOpen && !winState?.isMinimized && !hasPlayedOpen) {
      playOpen();
      setHasPlayedOpen(true);
    } else if (!winState?.isOpen) {
      setHasPlayedOpen(false);
    }
  }, [winState?.isOpen, winState?.isMinimized, hasPlayedOpen, playOpen]);

  const handleMinimize = useCallback(() => {
    playClose();
    minimizeWindow(id);
  }, [minimizeWindow, id, playClose]);

  const handleClose = useCallback(() => {
    playClose();
    closeWindow(id);
  }, [closeWindow, id, playClose]);

  const startResize = (e: React.PointerEvent, direction: 'e' | 's' | 'se') => {
    if (isMaximized || snapState !== 'none') return;
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) {
        newWidth = Math.min(window.innerWidth - 32, Math.max(380, startWidth + (moveEvent.clientX - startX)));
      }
      if (direction.includes('s')) {
        newHeight = Math.min(window.innerHeight - 128, Math.max(260, startHeight + (moveEvent.clientY - startY)));
      }

      setSize({ width: newWidth, height: newHeight });
    };

    const onPointerUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Focus window when it opens
  useEffect(() => {
    if (winState?.isOpen && !winState?.isMinimized) {
      focusWindow(id);
    }
  }, [winState?.isOpen, winState?.isMinimized, id, focusWindow]);

  if (!winState || !winState.isOpen) {
    return null;
  }

  const cascadeOffset = (winState?.cascadeIndex || 0) * 18;
  const targetWidth = Math.min(size.width, Math.max(340, viewport.width - 32));
  const targetHeight = Math.min(size.height, Math.max(260, viewport.height - 128));

  // Centrado horizontal balanceado
  const baseLeft = Math.max(
    16,
    Math.min(
      viewport.width - targetWidth - 16,
      Math.round((viewport.width - targetWidth) / 2) + cascadeOffset
    )
  );

  // Centrado vertical entre TopMenuBar (32px) y Dock (92px del borde inferior)
  const safeAvailableHeight = viewport.height - 128;
  const centeredTop = 36 + Math.max(0, Math.round((safeAvailableHeight - targetHeight) / 2));
  const baseTop = Math.max(
    40,
    Math.min(
      viewport.height - targetHeight - 92,
      centeredTop + cascadeOffset
    )
  );

  const getSnapPreviewStyle = (preview: typeof snapPreview): React.CSSProperties => {
    switch (preview) {
      case 'maximize':
        return { top: 36, left: 12, right: 12, height: 'calc(100vh - 120px)' };
      case 'left':
        return { top: 36, left: 12, width: 'calc(50vw - 18px)', height: 'calc(100vh - 120px)' };
      case 'right':
        return { top: 36, right: 12, width: 'calc(50vw - 18px)', height: 'calc(100vh - 120px)' };
      case 'top-left':
        return { top: 36, left: 12, width: 'calc(50vw - 18px)', height: 'calc(50vh - 66px)' };
      case 'top-right':
        return { top: 36, right: 12, width: 'calc(50vw - 18px)', height: 'calc(50vh - 66px)' };
      case 'bottom-left':
        return { bottom: 84, left: 12, width: 'calc(50vw - 18px)', height: 'calc(50vh - 66px)' };
      case 'bottom-right':
        return { bottom: 84, right: 12, width: 'calc(50vw - 18px)', height: 'calc(50vh - 66px)' };
      default:
        return {};
    }
  };

  return (
    <>
      {/* Recuadro translúcido fantasma de Aero Snap */}
      {mounted && snapPreview !== 'none' && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none rounded-2xl bg-sky-500/15 border-2 border-sky-400/60 shadow-[0_0_40px_rgba(56,189,248,0.3)] backdrop-blur-xs transition-all duration-150 ease-out"
          style={getSnapPreviewStyle(snapPreview)}
        />,
        document.body
      )}

      <motion.div
        ref={windowRef}
        key={`window-${id}`}
        drag={!isMaximized}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        onDragStart={() => {
          setIsDragging(true);
          setSnapState('none');
        }}
        onDrag={(e, info) => {
          const { x, y } = info.point;
          const width = window.innerWidth;
          const height = window.innerHeight;
          const threshold = 36;

          // Detección en tiempo real de bordes y esquinas para preview fantasma
          if (x < threshold && y < threshold + 32) {
            setSnapPreview('top-left');
          } else if (x > width - threshold && y < threshold + 32) {
            setSnapPreview('top-right');
          } else if (x < threshold && y > height - threshold - 110) {
            setSnapPreview('bottom-left');
          } else if (x > width - threshold && y > height - threshold - 110) {
            setSnapPreview('bottom-right');
          } else if (x < threshold) {
            setSnapPreview('left');
          } else if (x > width - threshold) {
            setSnapPreview('right');
          } else if (y < threshold + 32) {
            setSnapPreview('maximize');
          } else {
            setSnapPreview('none');
          }
        }}
        onDragEnd={(e, info) => {
          setIsDragging(false);
          setSnapPreview('none');
          const { x, y } = info.point;
          const width = window.innerWidth;
          const height = window.innerHeight;
          const threshold = 36;

          let targetSnap: typeof snapState = 'none';

          // Esquinas (Quarters)
          if (x < threshold && y < threshold + 32) {
            if (isMaximized) maximizeWindow(id);
            targetSnap = 'top-left';
          } else if (x > width - threshold && y < threshold + 32) {
            if (isMaximized) maximizeWindow(id);
            targetSnap = 'top-right';
          } else if (x < threshold && y > height - threshold - 110) {
            if (isMaximized) maximizeWindow(id);
            targetSnap = 'bottom-left';
          } else if (x > width - threshold && y > height - threshold - 110) {
            if (isMaximized) maximizeWindow(id);
            targetSnap = 'bottom-right';
          } 
          // Bordes Laterales (Halves)
          else if (x < threshold) {
            if (isMaximized) maximizeWindow(id);
            targetSnap = 'left';
          } else if (x > width - threshold) {
            if (isMaximized) maximizeWindow(id);
            targetSnap = 'right';
          }
          // Borde Superior (Maximize)
          else if (y < threshold + 32) {
            if (!isMaximized) maximizeWindow(id);
            targetSnap = 'none';
            playSnap();
          }

          if (targetSnap !== 'none') {
            setSnapState(targetSnap);
            playSnap();
          } else if (y >= threshold + 32) {
            setSnapState('none');
          }
        }}
        onPointerDownCapture={() => focusWindow(id)}
        initial={{ 
          scale: 0.85, 
          opacity: 0, 
          y: 16, 
          top: baseTop, 
          left: baseLeft 
        }}
        animate={winState.isMinimized ? {
          scale: 0.1,
          opacity: 0,
          y: 600,
          scaleX: 0.2,
          filter: 'blur(8px)',
          transitionEnd: { display: 'none' }
        } : { 
          display: 'flex',
          scale: 1, 
          opacity: 1,
          scaleX: 1,
          filter: 'blur(0px)',
          width: isMaximized ? '100%' : (
            snapState === 'left' || snapState === 'right' || snapState === 'top-left' || snapState === 'top-right' || snapState === 'bottom-left' || snapState === 'bottom-right'
              ? 'calc(50vw - 18px)'
              : targetWidth
          ),
          height: isMaximized ? 'calc(100% - 32px)' : (
            snapState === 'left' || snapState === 'right'
              ? 'calc(100vh - 120px)'
              : (snapState.includes('top') || snapState.includes('bottom')
                ? 'calc(50vh - 66px)'
                : targetHeight)
          ),
          x: isMaximized ? 0 : undefined,
          y: isMaximized ? 0 : undefined,
          top: isMaximized 
            ? 32 
            : (snapState === 'left' || snapState === 'right' || snapState.includes('top')
              ? 36
              : (snapState.includes('bottom') ? 'calc(50vh - 20px)' : baseTop)),
          left: isMaximized 
            ? 0 
            : (snapState === 'left' || snapState.includes('left')
              ? 12
              : (snapState === 'right' || snapState.includes('right') ? 'calc(50vw + 6px)' : baseLeft)),
        }}
        whileDrag={{ scale: 1.008, boxShadow: '0 25px 40px -12px rgba(0, 0, 0, 0.45)' }}
        transition={
          isResizing 
            ? { duration: 0 }
            : winState.isMinimized 
              ? { duration: 0.45, ease: [0.55, 0.06, 0.68, 0.19] }
              : { type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }
        }
        style={{ 
          zIndex: winState.zIndex, 
          willChange: 'transform, opacity',
          maxWidth: isMaximized || snapState !== 'none' ? undefined : 'calc(100vw - 32px)',
          maxHeight: isMaximized || snapState !== 'none' ? undefined : 'calc(100vh - 128px)',
        }}
        className={`absolute rounded-xl overflow-hidden bg-white/95 dark:bg-[#111111]/92 backdrop-blur-md transition-shadow duration-200 border flex-col pointer-events-auto ${
          isActive 
            ? 'shadow-2xl shadow-black/35 dark:shadow-black/60 ring-1 ring-black/5 dark:ring-white/10 border-black/15 dark:border-white/15' 
            : 'shadow-lg shadow-black/20 dark:shadow-black/35 border-black/10 dark:border-white/10 opacity-[0.98]'
        } ${
          isMaximized || snapState !== 'none' ? 'rounded-none' : ''
        }`}
      >
        {/* Title Bar */}
        <div 
          className={`h-10 flex items-center px-4 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 select-none ${!isMaximized ? 'cursor-move' : ''}`}
          onDoubleClick={() => maximizeWindow(id)}
          onPointerDown={(e) => {
            if (!isMaximized) dragControls.start(e);
          }}
        >
          {/* macOS style controls */}
          <div 
            className={`flex gap-2.5 items-center z-10 pointer-events-auto transition-opacity duration-150 ${
              isActive ? 'opacity-100' : 'opacity-65 hover:opacity-100'
            }`}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button 
              onClick={handleClose} 
              className="w-5 h-5 md:w-4 md:h-4 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group transition-colors duration-150 shadow-sm"
            >
              <X size={10} className="opacity-100 md:opacity-0 group-hover:opacity-100 text-black font-bold transition-opacity" />
            </button>
            <button 
              onClick={handleMinimize} 
              className="w-5 h-5 md:w-4 md:h-4 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group transition-colors duration-150 shadow-sm"
            >
              <Minus size={10} className="opacity-100 md:opacity-0 group-hover:opacity-100 text-black font-bold transition-opacity" />
            </button>
            <button 
              onClick={() => maximizeWindow(id)} 
              className="w-5 h-5 md:w-4 md:h-4 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group transition-colors duration-150 shadow-sm"
            >
              <Square size={8} className="opacity-100 md:opacity-0 group-hover:opacity-100 text-black font-bold transition-opacity" />
            </button>
          </div>
          
          {/* Title */}
          <div className={`flex-1 text-center text-xs font-semibold -ml-16 tracking-wide transition-colors ${
            isActive ? 'text-black dark:text-white' : 'text-black/60 dark:text-white/60'
          }`}>
            {t(id)}
          </div>
        </div>

        {/* Content */}
        <div 
          className={`flex-1 relative overflow-hidden min-h-0 ${isDragging || isResizing ? 'pointer-events-none' : ''} ${isMaximized && isMobile ? 'pb-28' : ''}`}
          onPointerDownCapture={(e) => {
            // Block drag from starting when clicking inside the window content
            e.stopPropagation();
          }}
        >
          {children}
        </div>

        {/* Resize Handles */}
        {!isMaximized && (
          <>
            <div 
              className="absolute right-0 top-0 bottom-0 w-3 cursor-e-resize hover:bg-white/10 transition-colors z-50"
              onPointerDown={(e) => startResize(e, 'e')}
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-3 cursor-s-resize hover:bg-white/10 transition-colors z-50"
              onPointerDown={(e) => startResize(e, 's')}
            />
            <div 
              className="absolute right-0 bottom-0 w-5 h-5 cursor-se-resize hover:bg-white/20 transition-colors z-50"
              onPointerDown={(e) => startResize(e, 'se')}
            />
          </>
        )}
      </motion.div>
    </>
  );
}
