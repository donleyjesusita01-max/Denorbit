import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  category: 'themes' | 'templates' | 'plugins' | 'tutorials';
  platform: 'wordpress' | 'shopify' | 'framer' | 'webflow' | 'other';
  author_id: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const usePublishedPosts = (limit?: number) =>
  useQuery({
    queryKey: ['posts', 'published', limit],
    queryFn: async (): Promise<Post[]> => {
      let q = supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Post[];
    },
  });

export const usePostBySlug = (slug: string | undefined) =>
  useQuery({
    queryKey: ['post', slug],
    queryFn: async (): Promise<Post | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data as Post | null;
    },
    enabled: !!slug,
  });

export const useAllPostsAdmin = () =>
  useQuery({
    queryKey: ['posts', 'admin', 'all'],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Post[];
    },
  });
