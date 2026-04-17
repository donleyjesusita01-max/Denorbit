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
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { CATEGORIES, PLATFORMS, CategorySlug, PlatformSlug } from '@/lib/categories';
import { useAuth } from '@/hooks/useAuth';

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

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
  const [category, setCategory] = useState<CategorySlug>('themes');
  const [platform, setPlatform] = useState<PlatformSlug>('other');
  const [published, setPublished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadingPost, setLoadingPost] = useState(!isNew);

  // Auto-generate slug from title for new posts
  const [slugTouched, setSlugTouched] = useState(false);
  useEffect(() => {
    if (isNew && !slugTouched) setSlug(slugify(title));
  }, [title, isNew, slugTouched]);

  // Load existing post
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-blog py-12 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to dashboard
        </Button>

        <h1 className="font-display text-4xl font-semibold tracking-tight mb-8">
          {isNew ? 'New review' : 'Edit review'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-5 shadow-soft">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/blog/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                  required
                  className="font-mono text-sm"
                />
              </div>
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
              <Label htmlFor="cover">Cover image URL</Label>
              <Input id="cover" type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://images.unsplash.com/…" />
              {coverImage && (
                <img src={coverImage} alt="" className="mt-2 aspect-[16/9] object-cover w-full max-w-sm border border-border" />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} placeholder="A short summary shown on listings." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={16} className="font-mono text-sm" />
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
