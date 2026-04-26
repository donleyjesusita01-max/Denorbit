import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { categoryLabel, platformLabel } from '@/lib/categories';
import { usePublishedPosts, type Post } from '@/hooks/usePosts';

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

// Detect TipTap-generated HTML vs legacy markdown.
const looksLikeHtml = (s: string) => /<\/?(p|h[1-6]|ul|ol|li|blockquote|pre|img|a|strong|em|hr)\b/i.test(s);

const renderMarkdown = (md: string) => {
  const lines = md.split('\n');
  const out: string[] = [];
  let inCode = false;
  let codeBuf: string[] = [];
  let inList = false;
  const flushList = () => { if (inList) { out.push('</ul>'); inList = false; } };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        out.push(`<pre><code>${codeBuf.join('\n').replace(/</g, '&lt;')}</code></pre>`);
        codeBuf = []; inCode = false;
      } else { flushList(); inCode = true; }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }

    if (/^### /.test(line)) { flushList(); out.push(`<h3>${line.slice(4)}</h3>`); }
    else if (/^## /.test(line)) { flushList(); out.push(`<h2>${line.slice(3)}</h2>`); }
    else if (/^# /.test(line)) { flushList(); out.push(`<h1>${line.slice(2)}</h1>`); }
    else if (/^- /.test(line)) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</li>`);
    } else if (/^\d+\. /.test(line)) {
      if (!inList) { out.push('<ol>'); inList = true; }
      out.push(`<li>${line.replace(/^\d+\. /, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</li>`);
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      const html = line
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      out.push(`<p>${html}</p>`);
    }
  }
  flushList();
  return out.join('\n');
};

const renderContent = (raw: string) => (looksLikeHtml(raw) ? raw : renderMarkdown(raw));

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: async (): Promise<Post | null> => {
      const { data, error } = await supabase.from('posts').select('*').eq('slug', slug!).maybeSingle();
      if (error) throw error;
      return data as Post | null;
    },
    enabled: !!slug,
  });

  const { data: allPosts } = usePublishedPosts();

  // Related: same category first, then most recent. Exclude current. Limit 3.
  const related = (allPosts ?? [])
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aMatch = post && a.category === post.category ? 1 : 0;
      const bMatch = post && b.category === post.category ? 1 : 0;
      if (aMatch !== bMatch) return bMatch - aMatch;
      const ad = a.published_at ? new Date(a.published_at).getTime() : 0;
      const bd = b.published_at ? new Date(b.published_at).getTime() : 0;
      return bd - ad;
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <article className="container-blog max-w-3xl">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back home</Link>
          </Button>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-4 w-32 bg-muted animate-pulse" />
              <div className="h-12 w-full bg-muted animate-pulse" />
              <div className="aspect-[16/9] bg-muted animate-pulse" />
            </div>
          ) : !post ? (
            <div className="text-center py-20">
              <h1 className="font-display text-4xl mb-4">Post not found</h1>
              <Button asChild><Link to="/">Back home</Link></Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <Link to={`/category/${post.category}`} className="blog-meta hover:underline">
                  {categoryLabel(post.category)}
                </Link>
                <span className="text-muted-foreground/60">·</span>
                <Link to={`/platform/${post.platform}`} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-accent">
                  {platformLabel(post.platform)}
                </Link>
                <span className="text-muted-foreground/60">·</span>
                <time className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {formatDate(post.published_at)}
                </time>
              </div>

              <h1 className="featured-title mb-6">{post.title}</h1>

              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed font-display italic mb-10 border-l-2 border-accent pl-5">
                  {post.excerpt}
                </p>
              )}

              {post.cover_image && (
                <img src={post.cover_image} alt={post.title} className="w-full aspect-[16/9] object-cover mb-12" />
              )}

              {post.content && (
                <div
                  className="article-body prose prose-lg max-w-none font-sans"
                  dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
                />
              )}
            </>
          )}
        </article>

        {post && related.length > 0 && (
          <section className="container-blog mt-24 pt-16 border-t border-border">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="section-eyebrow">Keep reading</p>
                <h2 className="section-title mb-0">Related reviews</h2>
              </div>
              <Link
                to="/posts"
                className="text-sm font-semibold text-accent hover:underline underline-offset-4"
              >
                Browse all →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {related.map((p) => (
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
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
