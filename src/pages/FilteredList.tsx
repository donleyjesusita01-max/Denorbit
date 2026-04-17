import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { CATEGORIES, PLATFORMS, categoryLabel, platformLabel } from '@/lib/categories';
import type { Post } from '@/hooks/usePosts';

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

interface FilteredListProps {
  type: 'category' | 'platform';
}

const FilteredList = ({ type }: FilteredListProps) => {
  const params = useParams();
  const slug = (type === 'category' ? params.slug : params.slug) as string;
  const label = type === 'category' ? categoryLabel(slug) : platformLabel(slug);
  const list = type === 'category' ? CATEGORIES : PLATFORMS;

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', type, slug],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .eq(type, slug as never)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Post[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-blog py-16">
        <div className="mb-12">
          <p className="section-eyebrow">{type === 'category' ? 'Category' : 'Platform'}</p>
          <h1 className="featured-title">{label}</h1>
          <p className="text-muted-foreground mt-3">
            {posts?.length ?? 0} {posts?.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-12">
          {list.map((item) => (
            <Link
              key={item.slug}
              to={`/${type}/${item.slug}`}
              className={`text-xs font-semibold uppercase tracking-[0.14em] px-3 py-1.5 border transition-colors ${
                item.slug === slug
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'border-border text-muted-foreground hover:border-accent hover:text-accent'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !posts || posts.length === 0 ? (
          <p className="text-muted-foreground">No reviews in this {type} yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {posts.map((p) => (
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
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FilteredList;
