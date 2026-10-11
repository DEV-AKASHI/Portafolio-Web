'use client';

import React, { useState, useEffect } from 'react';
import { insforge } from '@/lib/insforge';
import { FileText, ChevronRight, Hash, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useLocale } from 'next-intl';

interface BlogPost {
  id: string;
  title: string;
  title_en?: string;
  content: string;
  content_en?: string;
  slug: string;
  slug_en?: string;
  created_at: string;
  updated_at: string;
}

export default function NotesApp() {
  const locale = useLocale();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showMobileList, setShowMobileList] = useState(false);

  const getTitle = (post: BlogPost) => (locale === 'en' && post.title_en) ? post.title_en : post.title;
  const getContent = (post: BlogPost) => (locale === 'en' && post.content_en) ? post.content_en : post.content;
  const getSlug = (post: BlogPost) => (locale === 'en' && post.slug_en) ? post.slug_en : post.slug;

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await insforge.database
        .from('blog_posts')
        .select('*')
        // El RLS ya filtra is_published = true para usuarios anónimos
        .order('created_at', { ascending: false });
      
      if (data) {
        setPosts(data);
        if (data.length > 0) setSelectedPost(data[0]);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex h-full w-full bg-[#1e1e1e] text-[#d4d4d4] font-sans selection:bg-[#264f78] relative">
      {/* Sidebar (Explorer) */}
      <div className={`
        ${showMobileList ? 'flex absolute inset-0 z-20' : 'hidden sm:flex'}
        w-full sm:w-64 border-r border-[#333] flex-col shrink-0 bg-[#252526]
      `}>
        <div className="flex items-center justify-between p-3 border-b border-[#333]">
          <span className="text-xs font-semibold tracking-wider text-[#bbb] uppercase">
            Explorador
          </span>
          {showMobileList && selectedPost && (
            <button
              type="button"
              onClick={() => setShowMobileList(false)}
              className="sm:hidden text-xs text-[#519aba] font-medium px-2 py-1 bg-white/5 rounded"
            >
              Cerrar
            </button>
          )}
        </div>
        
        <div className="flex items-center px-3 py-1.5 text-sm font-bold bg-[#37373d]">
          <ChevronRight size={16} className="mr-1 text-[#bbb]" />
          <span>PORTAFOLIO_POSTS</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          {isLoading && (
            <div className="flex justify-center p-4"><Loader2 size={20} className="animate-spin text-[#007acc]" /></div>
          )}
          
          {!isLoading && posts.length === 0 && (
            <div className="px-8 py-2 text-xs text-[#888] italic">No hay notas publicadas.</div>
          )}
          
          {!isLoading && posts.length > 0 && posts.map(post => (
              <button
                key={post.id}
                type="button"
                onClick={() => {
                  setSelectedPost(post);
                  setShowMobileList(false);
                }}
                className={`w-full flex items-center px-6 py-2 sm:py-1 text-sm hover:bg-[#2a2d2e] transition-colors ${
                  selectedPost?.id === post.id ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'
                }`}
              >
                <FileText size={14} className="mr-2 text-[#519aba]" />
                <span className="truncate">{getSlug(post)}.md</span>
              </button>
            ))}
        </div>
      </div>

      {/* Main Content (Editor/Viewer) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
        {selectedPost ? (
          <>
            {/* Tabs */}
            <div className="flex items-center justify-between bg-[#2d2d2d] border-b border-[#333] overflow-x-auto [&::-webkit-scrollbar]:hidden px-2">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setShowMobileList(true)}
                  className="sm:hidden px-2.5 py-1 text-xs font-semibold text-[#519aba] hover:bg-white/5 rounded flex items-center gap-1 mr-1"
                >
                  📁 Explorador
                </button>
                <div className="flex items-center px-3 py-1.5 bg-[#1e1e1e] border-t-2 border-t-[#007acc] text-[#cccccc] min-w-max">
                  <FileText size={14} className="mr-2 text-[#519aba]" />
                  <span className="text-xs sm:text-sm">{getSlug(selectedPost)}.md</span>
                </div>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-12 font-sans">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8 pb-4 border-b border-[#333]">
                  <h1 className="text-3xl font-bold text-white mb-2">{getTitle(selectedPost)}</h1>
                  <div className="text-xs text-[#888]">
                    Última actualización: {new Date(selectedPost.updated_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="prose prose-invert prose-blue max-w-none 
                  text-[15px] sm:text-base leading-relaxed tracking-wide text-[#cccccc]
                  prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
                  prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-[#333] prose-h2:pb-2
                  prose-h3:text-xl prose-h3:mt-6
                  prose-p:mb-6 prose-p:leading-8
                  prose-a:text-[#3794ff] prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[#52a6ff]
                  prose-code:bg-[#2d2d2d] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[#d4d4d4] prose-code:font-medium
                  prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-[#333] prose-pre:text-[#d4d4d4] prose-pre:p-4 prose-pre:rounded-xl
                  prose-hr:border-[#333] prose-hr:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-l-[#007acc] prose-blockquote:bg-[#252526] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:my-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:text-[#aaaaaa]
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                  prose-li:my-2
                  marker:text-[#007acc]"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                    {getContent(selectedPost)}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#888]">
            <Hash size={64} className="mb-4 text-[#333]" />
            <p>Selecciona una nota para leerla</p>
          </div>
        )}
      </div>
    </div>
  );
}
