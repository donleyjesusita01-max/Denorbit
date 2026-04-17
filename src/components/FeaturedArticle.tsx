import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { usePublishedPosts } from '@/hooks/usePosts';
import { categoryLabel, platformLabel } from '@/lib/categories';

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const FeaturedArticle = () => {
  const { data: posts, isLoading } = usePublishedPosts(1);
  const post = posts?.[0];

  if (isLoading) {
    return (
      <section className="container-blog py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 aspect-[4/3] bg-muted animate-pulse" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-4 bg-muted w-32 animate-pulse" />
            <div className="h-12 bg-muted w-full animate-pulse" />
            <div className="h-4 bg-muted w-3/4 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="container-blog py-24 text-center">
        <p className="section-eyebrow">Welcome to PixelCritic</p>
        <h2 className="featured-title max-w-3xl mx-auto">No reviews published yet — sign in as admin to write your first one.</h2>
      </section>
    );
  }

  return (
    <section className="container-blog py-16 md:py-24">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-7 relative aspect-[4/3] overflow-hidden bg-muted">
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="object-cover w-full h-full transition-transform duration-1000 hover:scale-[1.03]"
              loading="eager"
              fetchPriority="high"
            />
          )}
          <span className="absolute top-5 left-5 bg-accent text-accent-foreground text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1.5">
            Featured Review
          </span>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="blog-meta">{categoryLabel(post.category)}</span>
            <span className="text-muted-foreground/60" aria-hidden>·</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {platformLabel(post.platform)}
            </span>
            <span className="text-muted-foreground/60" aria-hidden>·</span>
            <time className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {formatDate(post.published_at)}
            </time>
          </div>

          <h1 className="featured-title">{post.title}</h1>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed font-sans">{post.excerpt}</p>
          )}

          <div className="pt-2">
            <Button asChild size="lg" className="group">
              <Link to={`/blog/${post.slug}`}>
                Read the review
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const DefaultFeaturedArticle = FeaturedArticle;
export default FeaturedArticle;
