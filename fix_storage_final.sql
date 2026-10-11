ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin Full Storage Access" ON storage.objects;
DROP POLICY IF EXISTS "Public read for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert/update/delete for portfolio assets" ON storage.objects;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'portfolio-assets' OR bucket = 'portfolio-assets' );

CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( (bucket_id = 'portfolio-assets' OR bucket = 'portfolio-assets') AND auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c' );

CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( (bucket_id = 'portfolio-assets' OR bucket = 'portfolio-assets') AND auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c' );

CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( (bucket_id = 'portfolio-assets' OR bucket = 'portfolio-assets') AND auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c' );
