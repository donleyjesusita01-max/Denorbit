import { Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

const NewsletterCTA = () => {
  const [email, setEmail] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success('You’re on the list — welcome!');
    setEmail('');
  };

  return (
    <section className="container-blog py-14 md:py-20 border-t border-border">
      <div className="relative overflow-hidden border border-border bg-gradient-to-br from-accent/10 via-card to-secondary/40 p-6 md:p-12">
        <div
          aria-hidden
          className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-xs font-medium mb-5">
            <Sparkles className="h-3 w-3 text-accent" />
            One email a week. No spam, ever.
          </div>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight mb-3">
            The best new themes & plugins, delivered with a verdict.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Join 2,500+ designers and indie builders getting our weekly handpicked roundup.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11 bg-background"
                aria-label="Email address"
              />
            </div>
            <Button type="submit" className="h-11 px-6">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
