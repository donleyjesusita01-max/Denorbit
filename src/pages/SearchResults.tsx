import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { Post } from '@/hooks/usePosts';

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const SearchResults = () => {
  const [params, setParams] = useSearchParams();
  const initial = params.get('q') ?? '';
  const [query, setQuery] = useState(initial);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', initial],
    queryFn: async (): Promise<Post[]> => {
      if (!initial.trim()) return [];
      const term = `%${initial}%`;
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .or(`title.ilike.${term},excerpt.ilike.${term},content.ilike.${term}`)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Post[];
    },
    enabled: !!initial.trim(),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ q: query });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-blog py-16">
        <p className="section-eyebrow">Search</p>
        <h1 className="featured-title mb-8">Find a review</h1>

        <form onSubmit={onSubmit} className="flex gap-2 mb-12 max-w-xl">
          <Input
            type="search"
            placeholder="Search themes, plugins, tutorials…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit"><Search className="h-4 w-4 mr-1.5" /> Search</Button>
        </form>

        {!initial ? (
          <p className="text-muted-foreground">Type something above to start.</p>
        ) : isLoading ? (
          <p className="text-muted-foreground">Searching…</p>
        ) : !results || results.length === 0 ? (
          <p className="text-muted-foreground">No results for "{initial}".</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-8">
              {results.length} result{results.length === 1 ? '' : 's'} for "{initial}"
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {results.map((p) => (
                <BlogCard
                  key={p.id}
                  slug={p.slug}
                  title={p.title}
                  category={p.category}
                  platform={p.platform}
                  date={formatDate(p.published_at)}
                  excerpt={p.excerpt ?? undefined}
                  image={p.cover_image ?? '/placeholder.svg'}
                />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
