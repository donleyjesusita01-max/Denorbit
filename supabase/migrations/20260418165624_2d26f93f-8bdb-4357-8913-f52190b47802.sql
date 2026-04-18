-- Public storage bucket for post cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-covers', 'post-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view cover images
CREATE POLICY "Cover images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-covers');

-- Only admins can upload cover images
CREATE POLICY "Admins can upload cover images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'post-covers' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can update cover images
CREATE POLICY "Admins can update cover images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'post-covers' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can delete cover images
CREATE POLICY "Admins can delete cover images"
ON storage.objects FOR DELETE
USING (bucket_id = 'post-covers' AND public.has_role(auth.uid(), 'admin'));