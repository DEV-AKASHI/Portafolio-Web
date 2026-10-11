-- Script para crear las tablas de Chat en Vivo
-- Ejecuta este código en el panel SQL Editor de InsForge.

-- 1. Tabla de Sesiones de Chat (live_chats)
CREATE TABLE IF NOT EXISTS public.live_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_name TEXT DEFAULT 'Anónimo',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Mensajes (chat_messages)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES public.live_chats(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('visitor', 'admin')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Otorgar permisos de mínimo privilegio
GRANT SELECT, INSERT ON public.live_chats TO anon;
GRANT ALL ON public.live_chats TO authenticated;

GRANT SELECT, INSERT ON public.chat_messages TO anon;
GRANT ALL ON public.chat_messages TO authenticated;

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE public.live_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. Limpiar políticas previas
DROP POLICY IF EXISTS "Permitir a todos crear chats" ON public.live_chats;
DROP POLICY IF EXISTS "Permitir a todos leer sus chats" ON public.live_chats;
DROP POLICY IF EXISTS "Permitir a todos actualizar sus chats" ON public.live_chats;
DROP POLICY IF EXISTS "Permitir a todos enviar mensajes" ON public.chat_messages;
DROP POLICY IF EXISTS "Permitir a todos leer mensajes" ON public.chat_messages;
DROP POLICY IF EXISTS "Admin full access live_chats" ON public.live_chats;
DROP POLICY IF EXISTS "Admin full access chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Visitor create chat" ON public.live_chats;
DROP POLICY IF EXISTS "Visitor send message" ON public.chat_messages;
DROP POLICY IF EXISTS "Visitor read messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Visitor read own chat" ON public.live_chats;

-- 6. Políticas de Seguridad seguras
-- Administrador: control total validado por UID
CREATE POLICY "Admin full access live_chats" ON public.live_chats
    FOR ALL TO authenticated
    USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

CREATE POLICY "Admin full access chat_messages" ON public.chat_messages
    FOR ALL TO authenticated
    USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- Visitante: creación de sesión y lectura de sesión activa
CREATE POLICY "Visitor create chat" ON public.live_chats
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Visitor read own chat" ON public.live_chats
    FOR SELECT TO anon, authenticated
    USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c' OR status = 'active');

-- Visitante: enviar mensajes (únicamente con sender = 'visitor')
CREATE POLICY "Visitor send message" ON public.chat_messages
    FOR INSERT TO anon, authenticated
    WITH CHECK (sender = 'visitor');

-- Visitante: leer mensajes pertenecientes a chats activos
CREATE POLICY "Visitor read messages" ON public.chat_messages
    FOR SELECT TO anon, authenticated
    USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c' OR chat_id IN (SELECT id FROM public.live_chats WHERE status = 'active'));

-- 7. Habilitar REALTIME para que funcione el chat en vivo
NOTIFY pgrst, 'reload schema';
