import { useEffect } from 'react';

const SITEMAP_URL =
  'https://rqdopopsosbnzwaozwsd.supabase.co/functions/v1/sitemap';

/**
 * /sitemap.xml — convenience route that hands crawlers / curl users
 * straight to the live XML sitemap served by the edge function.
 */
const SitemapXml = () => {
  useEffect(() => {
    window.location.replace(SITEMAP_URL);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground mb-2">
          Sitemap
        </p>
        <p className="text-foreground">
          Redirecting to the XML sitemap…{' '}
          <a className="text-accent underline underline-offset-2" href={SITEMAP_URL}>
            Open it directly
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default SitemapXml;
