import { useState, useMemo } from 'react';
import BlogCard from './BlogCard';
import { usePublishedPosts } from '@/hooks/usePosts';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const POSTS_PER_PAGE = 16;

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const BlogGrid = () => {
  const { data: posts, isLoading } = usePublishedPosts();
  const [page, setPage] = useState(1);

  const all = posts ?? [];
  const totalPages = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE));
  const current = useMemo(
    () => all.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE),
    [all, page]
  );

  const goTo = (p: number) => {
    setPage(p);
    document.getElementById('all-posts-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="container-blog py-14 md:py-20 border-t border-border">
      <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
        <div>
          <p className="section-eyebrow">The Archive</p>
          <h2 id="all-posts-heading" className="section-title mb-0">Latest Reviews</h2>
        </div>
        {!isLoading && all.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{(page - 1) * POSTS_PER_PAGE + 1}</span>–
            <span className="text-foreground font-semibold">{Math.min(page * POSTS_PER_PAGE, all.length)}</span> of{' '}
            <span className="text-foreground font-semibold">{all.length}</span>
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[16/10] w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      ) : current.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {current.map((post) => (
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

          {totalPages > 1 && (
            <nav
              aria-label="Reviews pagination"
              className="mt-16 flex items-center justify-center gap-2 flex-wrap"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => goTo(p)}
                  className="w-10 h-9"
                  aria-current={p === page ? 'page' : undefined}
                  aria-label={`Page ${p}`}
                >
                  {p}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </nav>
          )}
        </>
      )}
    </section>
  );
};

export default BlogGrid;
