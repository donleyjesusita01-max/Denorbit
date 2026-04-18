import { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

const CoverImageField = ({ value, onChange }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please choose an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
    setUploading(true);
    const ext = file.name.split('.').pop() ?? 'png';
    const path = `covers/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('post-covers').upload(path, file);
    if (error) { setUploading(false); toast.error(error.message); return; }
    const { data } = supabase.storage.from('post-covers').getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    toast.success('Cover image uploaded');
  };

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="Cover preview" className="aspect-[16/9] object-cover w-full max-w-md border border-border rounded-md" />
          <Button
            type="button" variant="secondary" size="sm"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 h-7 w-7 p-0"
            aria-label="Remove cover"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </Button>
        <input
          ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
        <span className="text-xs text-muted-foreground">or paste a URL:</span>
        <Input
          type="url" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="https://…" className="max-w-xs h-9"
        />
      </div>
    </div>
  );
};

export default CoverImageField;
