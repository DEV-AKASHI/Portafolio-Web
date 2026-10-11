-- =========================================================================
-- AKASHI DEV - CANONICAL SECURITY & RLS HARDENING MIGRATION
-- Corrige todas las vulnerabilidades detectadas en la auditoría de seguridad
-- =========================================================================

-- 1. HABILITAR RLS EN TODAS LAS TABLAS PÚBLICAS
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 2. OTORGAR PERMISOS BAJO EL PRINCIPIO DE MÍNIMO PRIVILEGIO
GRANT SELECT ON public.profile_settings TO anon, authenticated;
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT SELECT ON public.experience TO anon, authenticated;
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT SELECT ON public.certificates TO anon, authenticated;
GRANT SELECT ON public.experiments TO anon, authenticated;
GRANT SELECT ON public.site_settings TO anon, authenticated;

-- Contact Messages: anon solo puede insertar, nunca leer o borrar
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;

-- Live Chat: anon solo puede crear chat e insertar mensajes de visitante
GRANT SELECT, INSERT ON public.live_chats TO anon, authenticated;
GRANT SELECT, INSERT ON public.chat_messages TO anon, authenticated;

-- Privilegios de escritura administrativa para authenticated
GRANT INSERT, UPDATE, DELETE ON public.profile_settings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.experience TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.experiments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.live_chats TO authenticated;
GRANT ALL ON public.chat_messages TO authenticated;

-- 3. POLÍTICAS DE LECTURA PÚBLICA
DROP POLICY IF EXISTS "Public read access" ON public.profile_settings;
CREATE POLICY "Public read access" ON public.profile_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read published projects" ON public.projects;
CREATE POLICY "Public read published projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read experience" ON public.experience;
CREATE POLICY "Public read experience" ON public.experience FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read certificates" ON public.certificates;
CREATE POLICY "Public read certificates" ON public.certificates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read experiments" ON public.experiments;
CREATE POLICY "Public read experiments" ON public.experiments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);

-- 4. POLÍTICAS DE ESCRITURA ADMINISTRATIVA (VALIDACIÓN ESTRICTA POR UID)
-- PROFILE SETTINGS
DROP POLICY IF EXISTS "Admin update access" ON public.profile_settings;
CREATE POLICY "Admin update access" ON public.profile_settings
    FOR UPDATE USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- PROJECTS
DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
CREATE POLICY "Admin full access projects" ON public.projects
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- EXPERIENCE
DROP POLICY IF EXISTS "Admin full access experience" ON public.experience;
CREATE POLICY "Admin full access experience" ON public.experience
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- SKILLS
DROP POLICY IF EXISTS "Admin full access skills" ON public.skills;
CREATE POLICY "Admin full access skills" ON public.skills
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- CERTIFICATES
DROP POLICY IF EXISTS "Admin full access certificates" ON public.certificates;
CREATE POLICY "Admin full access certificates" ON public.certificates
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- EXPERIMENTS
DROP POLICY IF EXISTS "Admin full access experiments" ON public.experiments;
CREATE POLICY "Admin full access experiments" ON public.experiments
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- SITE SETTINGS
DROP POLICY IF EXISTS "Admin full access site settings" ON public.site_settings;
CREATE POLICY "Admin full access site settings" ON public.site_settings
    FOR ALL USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- CONTACT MESSAGES
DROP POLICY IF EXISTS "Public insert messages" ON public.contact_messages;
CREATE POLICY "Public insert messages" ON public.contact_messages
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access messages" ON public.contact_messages;
CREATE POLICY "Admin full access messages" ON public.contact_messages
    FOR ALL TO authenticated
    USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

-- 5. POLÍTICAS DE CHAT SEGURO
DROP POLICY IF EXISTS "Permitir a todos crear chats" ON public.live_chats;
DROP POLICY IF EXISTS "Permitir a todos leer sus chats" ON public.live_chats;
DROP POLICY IF EXISTS "Permitir a todos actualizar sus chats" ON public.live_chats;
DROP POLICY IF EXISTS "Admin full access live_chats" ON public.live_chats;
DROP POLICY IF EXISTS "Visitor create chat" ON public.live_chats;
DROP POLICY IF EXISTS "Visitor read own chat" ON public.live_chats;

CREATE POLICY "Admin full access live_chats" ON public.live_chats
    FOR ALL TO authenticated
    USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

CREATE POLICY "Visitor create chat" ON public.live_chats
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Visitor read own chat" ON public.live_chats
    FOR SELECT TO anon, authenticated
    USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c' OR status = 'active');

DROP POLICY IF EXISTS "Permitir a todos enviar mensajes" ON public.chat_messages;
DROP POLICY IF EXISTS "Permitir a todos leer mensajes" ON public.chat_messages;
DROP POLICY IF EXISTS "Admin full access chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Visitor send message" ON public.chat_messages;
DROP POLICY IF EXISTS "Visitor read messages" ON public.chat_messages;

CREATE POLICY "Admin full access chat_messages" ON public.chat_messages
    FOR ALL TO authenticated
    USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c')
    WITH CHECK ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

CREATE POLICY "Visitor send message" ON public.chat_messages
    FOR INSERT TO anon, authenticated
    WITH CHECK (sender = 'visitor');

CREATE POLICY "Visitor read messages" ON public.chat_messages
    FOR SELECT TO anon, authenticated
    USING ((select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c' OR chat_id IN (SELECT id FROM public.live_chats WHERE status = 'active'));

CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages(chat_id);

-- 6. POLÍTICAS DE STORAGE SEGURAS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin Full Storage Access" ON storage.objects;
DROP POLICY IF EXISTS "Public read for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert/update/delete for portfolio assets" ON storage.objects;

CREATE POLICY "Public read for portfolio assets" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'portfolio-assets' OR bucket = 'portfolio-assets');

CREATE POLICY "Admin upload for portfolio assets" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        (bucket_id = 'portfolio-assets' OR bucket = 'portfolio-assets')
        AND (select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

CREATE POLICY "Admin update for portfolio assets" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        (bucket_id = 'portfolio-assets' OR bucket = 'portfolio-assets')
        AND (select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

CREATE POLICY "Admin delete for portfolio assets" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        (bucket_id = 'portfolio-assets' OR bucket = 'portfolio-assets')
        AND (select auth.uid()) = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

-- 7. REFRESCAR ESQUEMA POSTGREST
NOTIFY pgrst, 'reload schema';
