import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import RichTextEditor from '@/components/admin/RichTextEditor';
import CoverImageField from '@/components/admin/CoverImageField';
import { CATEGORIES, PLATFORMS, CategorySlug, PlatformSlug } from '@/lib/categories';
import { useAuth } from '@/hooks/useAuth';

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const wordCount = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;

const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [category, setCategory] = useState<CategorySlug>('themes');
  const [platform, setPlatform] = useState<PlatformSlug>('other');
  const [published, setPublished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadingPost, setLoadingPost] = useState(!isNew);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isNew && !slugTouched) setSlug(slugify(title));
  }, [title, isNew, slugTouched]);

  useEffect(() => {
    if (isNew) return;
    supabase.from('posts').select('*').eq('id', id!).maybeSingle().then(({ data, error }) => {
      if (error) { toast.error(error.message); return; }
      if (!data) { toast.error('Post not found'); navigate('/admin'); return; }
      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt ?? '');
      setContent(data.content ?? '');
      setCoverImage(data.cover_image ?? '');
      setMetaTitle((data as any).meta_title ?? '');
      setMetaDescription((data as any).meta_description ?? '');
      setCategory(data.category as CategorySlug);
      setPlatform(data.platform as PlatformSlug);
      setPublished(data.published);
      setSlugTouched(true);
      setLoadingPost(false);
    });
  }, [id, isNew, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) { toast.error('Title and slug are required'); return; }
    setBusy(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim() || null,
      cover_image: coverImage.trim() || null,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      category, platform, published,
      author_id: user?.id ?? null,
    };

    if (isNew) {
      const { error } = await supabase.from('posts').insert(payload);
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      toast.success('Post created');
    } else {
      const { error } = await supabase.from('posts').update(payload).eq('id', id!);
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      toast.success('Post saved');
    }
    qc.invalidateQueries({ queryKey: ['posts'] });
    navigate('/admin');
  };

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container-blog py-12 text-muted-foreground">Loading…</main>
      </div>
    );
  }

  const wc = wordCount(content);
  const readMins = Math.max(1, Math.round(wc / 220));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-blog py-12 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to dashboard
        </Button>

        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {isNew ? 'New review' : 'Edit review'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {wc.toLocaleString()} words · ~{readMins} min read
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-6 shadow-soft">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">URL slug</Label>
                {slugTouched && (
                  <button
                    type="button"
                    onClick={() => { setSlug(slugify(title)); setSlugTouched(false); }}
                    className="text-xs text-accent hover:underline inline-flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset to title
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">/blog/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    // Allow hyphens freely while typing; only lowercase and strip invalid chars.
                    const cleaned = e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '');
                    setSlug(cleaned);
                    setSlugTouched(true);
                  }}
                  onBlur={() => setSlug((s) => s.replace(/-+/g, '-').replace(/^-|-$/g, ''))}
                  required
                  className="font-mono text-sm"
                  placeholder="my-custom-url"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-generated from the title. Edit anytime to set a custom URL.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as CategorySlug)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={(v) => setPlatform(v as PlatformSlug)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.slug} value={p.slug}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover image</Label>
              <CoverImageField value={coverImage} onChange={setCoverImage} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                rows={3} placeholder="A short summary shown on listings and previews."
              />
            </div>

            <div className="border-t border-border pt-5 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-1">
                  Search engine optimization
                </p>
                <p className="text-xs text-muted-foreground">
                  Optional. If left empty, the title and excerpt above are used.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_title">Meta title</Label>
                  <span className={`text-[11px] ${metaTitle.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {metaTitle.length}/60
                  </span>
                </div>
                <Input
                  id="meta_title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || 'Custom title shown on Google and browser tabs'}
                  maxLength={120}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta description</Label>
                  <span className={`text-[11px] ${metaDescription.length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {metaDescription.length}/160
                  </span>
                </div>
                <Textarea
                  id="meta_description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  placeholder={excerpt || 'Short snippet shown in Google search results (150–160 chars).'}
                  maxLength={300}
                />
              </div>
            </div>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing your review… use the toolbar to format, add links and embed images."
              />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-5">
              <div className="space-y-0.5">
                <Label htmlFor="publish">Published</Label>
                <p className="text-xs text-muted-foreground">Make this post visible to everyone.</p>
              </div>
              <Switch id="publish" checked={published} onCheckedChange={setPublished} />
            </div>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>Cancel</Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Saving…' : isNew ? 'Create post' : 'Save changes'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PostEditor;
