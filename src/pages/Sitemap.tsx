import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';

const SITEMAP_URL =
  'https://rqdopopsosbnzwaozwsd.supabase.co/functions/v1/sitemap';

const Sitemap = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Sitemap — Denorbit';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'XML sitemap for Denorbit — submit this URL in Google Search Console to index all pages and reviews.'
      );
    }
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(SITEMAP_URL);
    setCopied(true);
    toast.success('Sitemap URL copied');
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container-blog py-16 md:py-20 max-w-3xl">
        <p className="section-eyebrow">SEO</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
          Sitemap
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Denorbit publishes a live XML sitemap that automatically updates whenever a
          new review is published. Submit the URL below in Google Search Console (or
          any other search engine) — you don't have to resubmit it when you publish
          new posts.
        </p>

        <div className="bg-card border border-border rounded-md p-5 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2">
            Sitemap URL
          </p>
          <code className="block text-sm font-mono break-all text-foreground mb-4">
            {SITEMAP_URL}
          </code>
          <div className="flex flex-wrap gap-2">
            <Button onClick={copy} size="sm" variant="default">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5" /> Copy URL
                </>
              )}
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={SITEMAP_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1.5" /> View XML
              </a>
            </Button>
          </div>
        </div>

        <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-foreground mt-12 mb-3">
          How to submit it to Google
        </h2>
        <ol className="list-decimal ml-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>
            Open{' '}
            <a
              className="text-accent underline underline-offset-2"
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Search Console
            </a>{' '}
            and select your property.
          </li>
          <li>In the left sidebar, click <strong className="text-foreground">Sitemaps</strong>.</li>
          <li>Paste the sitemap URL above and click <strong className="text-foreground">Submit</strong>.</li>
          <li>Google will recrawl it automatically — every newly published review is included with no extra work.</li>
        </ol>

        <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-foreground mt-12 mb-3">
          What's included
        </h2>
        <ul className="list-disc ml-5 space-y-1.5 text-muted-foreground leading-relaxed">
          <li>Homepage and the All Posts archive</li>
          <li>About, Contact, Privacy, and Terms pages</li>
          <li>Every category and platform index page</li>
          <li>Every published review (added automatically on publish)</li>
        </ul>

        <p className="mt-10 text-sm text-muted-foreground">
          The sitemap is also referenced in{' '}
          <a
            className="text-accent underline underline-offset-2"
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
          >
            /robots.txt
          </a>
          , so most crawlers will discover it on their own.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Sitemap;
