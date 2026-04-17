-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'author');
CREATE TYPE public.post_category AS ENUM ('themes', 'templates', 'plugins', 'tutorials');
CREATE TYPE public.post_platform AS ENUM ('wordpress', 'shopify', 'framer', 'webflow', 'other');

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Roles are readable by everyone"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ POSTS ============
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category post_category NOT NULL DEFAULT 'themes',
  platform post_platform NOT NULL DEFAULT 'other',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_posts_platform ON public.posts(platform);
CREATE INDEX idx_posts_published ON public.posts(published, published_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are visible to everyone"
  ON public.posts FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert posts"
  ON public.posts FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update posts"
  ON public.posts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete posts"
  ON public.posts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ TIMESTAMP TRIGGER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  -- Set published_at the first time published flips to true
  IF TG_TABLE_NAME = 'posts' THEN
    IF NEW.published = true AND (OLD.published IS DISTINCT FROM true) AND NEW.published_at IS NULL THEN
      NEW.published_at = now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Also handle published_at on INSERT
CREATE OR REPLACE FUNCTION public.set_published_at_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.published = true AND NEW.published_at IS NULL THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_posts_published_at
  BEFORE INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_published_at_on_insert();