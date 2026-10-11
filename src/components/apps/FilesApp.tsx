'use client';

import React, { useState } from 'react';
import { Folder, FileText, Image as ImageIcon, Download, HardDrive, File, ChevronRight } from 'lucide-react';
import { useWindowStore } from '@/store/useWindowStore';
import { useSystemSounds } from '@/hooks/useSystemSounds';

interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'text' | 'image' | 'app';
  icon: React.ElementType;
  targetApp?: any;
  targetUrl?: string;
}

const fileSystem: Record<string, FileNode[]> = {
  'Escritorio': [
    { id: '1', name: 'Proyectos', type: 'app', icon: Folder, targetApp: 'projects' },
    { id: '2', name: 'CV_Akashi.pdf', type: 'pdf', icon: FileText, targetUrl: '/cv.pdf' },
  ],
  'Documentos': [
    { id: '3', name: 'Sobre mi.txt', type: 'app', icon: FileText, targetApp: 'about' },
    { id: '4', name: 'Habilidades', type: 'app', icon: Folder, targetApp: 'skills' },
    { id: '5', name: 'Experiencia', type: 'app', icon: Folder, targetApp: 'experience' },
  ],
  'Imágenes': [
    { id: '6', name: 'FotoPerfil.jpg', type: 'image', icon: ImageIcon },
  ],
  'Descargas': [
    { id: '7', name: 'Certificados', type: 'app', icon: Folder, targetApp: 'certificates' },
  ]
};

const sidebarItems = [
  { id: 'Escritorio', icon: HardDrive },
  { id: 'Documentos', icon: FileText },
  { id: 'Imágenes', icon: ImageIcon },
  { id: 'Descargas', icon: Download },
];

export default function FilesApp() {
  const [currentFolder, setCurrentFolder] = useState<string>('Escritorio');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { openWindow } = useWindowStore();
  const { playClick, playOpen } = useSystemSounds();

  const handleDoubleClick = (file: FileNode) => {
    playOpen();
    if (file.type === 'app' && file.targetApp) {
      openWindow(file.targetApp);
    } else if (file.type === 'pdf' && file.targetUrl) {
      window.open(file.targetUrl, '_blank');
    } else {
      // Just a mock for image/text
      alert(`Abriendo ${file.name}... (Simulación)`);
    }
  };

  const handleClick = (id: string) => {
    playClick();
    setSelectedFile(id);
  };

  return (
    <div className="flex h-full w-full bg-white/95 dark:bg-[#1c1c1e]/95 text-black dark:text-white rounded-b-xl overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-28 sm:w-48 bg-gray-100/50 dark:bg-black/20 border-r border-black/5 dark:border-white/5 flex flex-col p-1.5 sm:p-2 shrink-0">
        <div className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1 sm:px-2 mt-2 uppercase tracking-wider">
          Favoritos
        </div>
        {sidebarItems.map(item => (
          <button
            key={item.id}
            onClick={() => { playClick(); setCurrentFolder(item.id); setSelectedFile(null); }}
            className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1.5 rounded-md text-xs sm:text-sm transition-colors ${
              currentFolder === item.id 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <item.icon size={15} className={currentFolder === item.id ? 'text-white' : 'text-blue-500'} />
            <span className="truncate">{item.id}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-10 sm:h-12 border-b border-black/5 dark:border-white/5 flex items-center px-3 sm:px-4 gap-2 bg-gray-50/50 dark:bg-white/5">
          <ChevronRight size={14} className="text-gray-400" />
          <span className="font-medium text-xs sm:text-sm truncate">{currentFolder}</span>
        </div>

        {/* File Grid */}
        <div className="flex-1 p-3 sm:p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 content-start overflow-y-auto pb-10">
          {fileSystem[currentFolder]?.map((file) => (
            <div
              key={file.id}
              onClick={() => {
                handleClick(file.id);
                if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
                  handleDoubleClick(file);
                }
              }}
              onDoubleClick={() => handleDoubleClick(file)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedFile === file.id 
                  ? 'bg-blue-500/20 border border-blue-500/50' 
                  : 'border border-transparent hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <file.icon 
                size={36} 
                strokeWidth={1}
                className={file.type === 'folder' || file.type === 'app' ? 'text-blue-400 fill-blue-400/20' : 'text-gray-500'} 
              />
              <span className="text-[11px] sm:text-xs text-center line-clamp-2 break-all">{file.name}</span>
            </div>
          ))}
          {(!fileSystem[currentFolder] || fileSystem[currentFolder].length === 0) && (
            <div className="col-span-full flex items-center justify-center text-sm text-gray-500 h-32">
              Carpeta vacía
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
