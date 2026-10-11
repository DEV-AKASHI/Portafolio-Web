import { create } from 'zustand';

export type AppId = 'terminal' | 'projects' | 'about' | 'skills' | 'contact' | 'chat' | 'experiments' | 'browser' | 'certificates' | 'experience' | 'settings' | 'music' | 'files' | 'notes' | 'recruiter' | 'resume';

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  cascadeIndex?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

interface WindowStore {
  windows: Record<AppId, WindowState>;
  activeWindow: AppId | null;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  resizeWindow: (id: AppId, width: number, height: number) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  isBooted: boolean;
  setBooted: (val: boolean) => void;
  isLocked: boolean;
  setLocked: (val: boolean) => void;
}

const defaultWindows: Record<AppId, WindowState> = {
  terminal: { id: 'terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 760, height: 460 },
  projects: { id: 'projects', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 840, height: 480 },
  about: { id: 'about', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 780, height: 460 },
  skills: { id: 'skills', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 820, height: 480 },
  contact: { id: 'contact', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 740, height: 470 },
  chat: { id: 'chat', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 400, height: 480 },
  experiments: { id: 'experiments', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 840, height: 480 },
  browser: { id: 'browser', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 840, height: 480 },
  certificates: { id: 'certificates', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 840, height: 480 },
  experience: { id: 'experience', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 820, height: 480 },
  settings: { id: 'settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 680, height: 450 },
  music: { id: 'music', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 340, height: 400 },
  files: { id: 'files', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 750, height: 460 },
  notes: { id: 'notes', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 780, height: 480 },
  recruiter: { id: 'recruiter', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 820, height: 490 },
  resume: { id: 'resume', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 840, height: 490 },
};

let highestZIndex = 1;

export const useWindowStore = create<WindowStore>((set) => ({
  windows: defaultWindows,
  activeWindow: null,
  wallpaperId: globalThis.window === undefined ? 'global' : localStorage.getItem('os_wallpaper') || 'global',

  setWallpaperId: (id) => {
    if (globalThis.window !== undefined) localStorage.setItem('os_wallpaper', id);
    set({ wallpaperId: id });
  },

  openWindow: (id) => set((state) => {
    highestZIndex += 1;
    // Desfase en cascada para no apilar ventanas exactamente en la misma coordenada
    const currentOpen = Object.values(state.windows).filter(w => w.isOpen && !w.isMinimized && w.id !== id);
    const cascadeIndex = currentOpen.length % 5;

    return {
      windows: {
        ...state.windows,
        [id]: { 
          ...state.windows[id], 
          isOpen: true, 
          isMinimized: false, 
          zIndex: highestZIndex,
          cascadeIndex: state.windows[id].isOpen && state.windows[id].cascadeIndex !== undefined 
            ? state.windows[id].cascadeIndex 
            : cascadeIndex
        }
      },
      activeWindow: id
    };
  }),

  closeWindow: (id) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], isOpen: false }
    },
    activeWindow: state.activeWindow === id ? null : state.activeWindow
  })),

  minimizeWindow: (id) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], isMinimized: true }
    },
    activeWindow: state.activeWindow === id ? null : state.activeWindow
  })),

  maximizeWindow: (id) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], isMaximized: !state.windows[id].isMaximized }
    }
  })),

  focusWindow: (id) => set((state) => {
    if (state.activeWindow === id && state.windows[id].zIndex === highestZIndex) {
      return state;
    }
    highestZIndex += 1;
    return {
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: false, zIndex: highestZIndex }
      },
      activeWindow: id
    };
  }),

  resizeWindow: (id, width, height) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], width, height }
    }
  })),

  moveWindow: (id, x, y) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], x, y },
    },
  })),

  isBooted: false,
  setBooted: (val) => set({ isBooted: val }),
  
  isLocked: true,
  setLocked: (val) => set({ isLocked: val }),
}));
