import { Link } from 'react-router-dom';
import { categoryLabel, platformLabel } from '@/lib/categories';

interface BlogCardProps {
  title: string;
  category: string;
  platform?: string;
  date: string;
  excerpt?: string;
  image: string;
  slug: string;
  isSmall?: boolean;
}

const BlogCard = ({
  title, category, platform, date, excerpt, image, slug, isSmall = false,
}: BlogCardProps) => {
  return (
    <article className="blog-card group bg-card border border-border rounded-md overflow-hidden hover:shadow-[var(--shadow-lift)] transition-shadow">
      <Link
        to={`/blog/${slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        aria-label={`Read: ${title}`}
      >
        <div className={`relative overflow-hidden bg-muted ${isSmall ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
          {platform && (
            <span className="absolute top-3 left-3 bg-background/90 backdrop-blur text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground px-2 py-1 rounded">
              {platformLabel(platform)}
            </span>
          )}
        </div>

        <div className={`px-5 py-5 space-y-3 ${isSmall ? 'space-y-2' : ''}`}>
          <div className="flex items-center gap-3">
            <span className="blog-meta">{categoryLabel(category)}</span>
            <span className="text-muted-foreground/60 text-xs" aria-hidden>·</span>
            <time className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{date}</time>
          </div>

          <h3 className={`font-display font-semibold text-foreground leading-[1.2] tracking-tight group-hover:text-accent transition-colors ${
            isSmall ? 'text-base' : 'text-xl'
          }`}>
            {title}
          </h3>

          {excerpt && !isSmall && (
            <p className="text-sm text-muted-foreground leading-relaxed">{excerpt}</p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
