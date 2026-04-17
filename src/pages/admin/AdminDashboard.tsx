import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAllPostsAdmin } from '@/hooks/usePosts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Header from '@/components/Header';
import { categoryLabel, platformLabel } from '@/lib/categories';
import { useAuth } from '@/hooks/useAuth';

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const AdminDashboard = () => {
  const { data: posts, isLoading } = useAllPostsAdmin();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Post deleted');
    qc.invalidateQueries({ queryKey: ['posts'] });
  };

  const togglePublish = async (id: string, current: boolean) => {
    const { error } = await supabase.from('posts').update({ published: !current }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success(current ? 'Unpublished' : 'Published');
    qc.invalidateQueries({ queryKey: ['posts'] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-blog py-12">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <p className="section-eyebrow">Admin</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight">Posts</h1>
            <p className="text-sm text-muted-foreground mt-2">Signed in as {user?.email}</p>
          </div>
          <Button onClick={() => navigate('/admin/posts/new')} size="lg">
            <Plus className="h-4 w-4 mr-2" /> New post
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((p) => (
              <Card key={p.id} className="p-5 flex items-center justify-between gap-4 flex-wrap shadow-soft">
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant={p.published ? 'default' : 'secondary'}>
                      {p.published ? 'Published' : 'Draft'}
                    </Badge>
                    <span className="text-[11px] font-semibold text-accent uppercase tracking-[0.14em]">
                      {categoryLabel(p.category)}
                    </span>
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      · {platformLabel(p.platform)}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold leading-tight">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Updated {formatDate(p.updated_at)} · /blog/{p.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => togglePublish(p.id, p.published)} aria-label={p.published ? 'Unpublish' : 'Publish'}>
                    {p.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/posts/${p.id}`}><Pencil className="h-4 w-4 mr-1.5" /> Edit</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          "{p.title}" will be permanently removed. This can't be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive text-destructive-foreground">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No posts yet.</p>
            <Button onClick={() => navigate('/admin/posts/new')}>
              <Plus className="h-4 w-4 mr-2" /> Create your first post
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
