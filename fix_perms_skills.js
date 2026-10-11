const { execSync } = require('child_process');

const sql = `
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.skills TO authenticated;
GRANT SELECT ON TABLE public.skills TO anon;
GRANT SELECT, UPDATE, DELETE ON TABLE public.contact_messages TO authenticated;
GRANT INSERT ON TABLE public.contact_messages TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access skills" ON public.skills;
CREATE POLICY "Admin full access skills" ON public.skills FOR ALL USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c') WITH CHECK (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert messages" ON public.contact_messages;
CREATE POLICY "Public insert messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access messages" ON public.contact_messages;
CREATE POLICY "Admin full access messages" ON public.contact_messages FOR ALL USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c') WITH CHECK (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');

NOTIFY pgrst, 'reload schema';
`;

try {
  const escapedSql = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
  execSync(`npx @insforge/cli db query "${escapedSql}"`, { stdio: 'inherit' });
  console.log("Success fixing permissions");
} catch (e) {
  console.error("Failed:", e);
}
