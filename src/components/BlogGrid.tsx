import BlogCard from './BlogCard';
import { usePublishedPosts } from '@/hooks/usePosts';
import { Skeleton } from '@/components/ui/skeleton';

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const BlogGrid = () => {
  const { data: posts, isLoading } = usePublishedPosts();
  // Skip the first one (already shown in FeaturedArticle)
  const grid = (posts ?? []).slice(1);

  return (
    <section className="container-blog py-20 border-t border-border">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="section-eyebrow">The Archive</p>
          <h2 id="all-posts-heading" className="section-title mb-0">All Reviews</h2>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[16/10] w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      ) : grid.length === 0 ? (
        <p className="text-muted-foreground">No more reviews yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {grid.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              category={post.category}
              platform={post.platform}
              date={formatDate(post.published_at)}
              excerpt={post.excerpt ?? undefined}
              image={post.cover_image ?? '/placeholder.svg'}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogGrid;
