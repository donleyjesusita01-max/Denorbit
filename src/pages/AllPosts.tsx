import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { usePublishedPosts } from '@/hooks/usePosts';

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const AllPosts = () => {
  const { data: posts, isLoading } = usePublishedPosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-blog py-16">
        <p className="section-eyebrow">The Archive</p>
        <h1 className="featured-title mb-4">All Reviews</h1>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Every theme, template, plugin and tutorial we've published — most recent first.
        </p>

        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !posts || posts.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
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

export default AllPosts;
