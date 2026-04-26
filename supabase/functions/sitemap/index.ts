// Public XML sitemap — Google Search Console compatible.
// Auto-includes the homepage, static pages, category/platform indexes, and every published post.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const CATEGORIES = ["themes", "templates", "plugins", "tutorials"];
const PLATFORMS = ["wordpress", "shopify", "framer", "webflow"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Detect site origin from a configurable env var, falling back to the request origin.
  const siteUrl =
    Deno.env.get("SITE_URL")?.replace(/\/$/, "") ||
    new URL(req.url).origin.replace(/\/$/, "");

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data: posts, error } = await supabase
    .from("posts")
    .select("slug, updated_at, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }

  const today = new Date().toISOString().slice(0, 10);

  type Url = { loc: string; lastmod: string; changefreq: string; priority: string };
  const urls: Url[] = [
    { loc: `${siteUrl}/`, lastmod: today, changefreq: "daily", priority: "1.0" },
    { loc: `${siteUrl}/posts`, lastmod: today, changefreq: "daily", priority: "0.9" },
    { loc: `${siteUrl}/about`, lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: `${siteUrl}/contact`, lastmod: today, changefreq: "monthly", priority: "0.5" },
    { loc: `${siteUrl}/privacy`, lastmod: today, changefreq: "yearly", priority: "0.3" },
    { loc: `${siteUrl}/terms`, lastmod: today, changefreq: "yearly", priority: "0.3" },
    ...CATEGORIES.map((c) => ({
      loc: `${siteUrl}/category/${c}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    })),
    ...PLATFORMS.map((p) => ({
      loc: `${siteUrl}/platform/${p}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    })),
    ...(posts ?? []).map((p) => ({
      loc: `${siteUrl}/blog/${p.slug}`,
      lastmod: (p.updated_at ?? p.published_at ?? today).slice(0, 10),
      changefreq: "weekly",
      priority: "0.8",
    })),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n` +
          `    <loc>${escapeXml(u.loc)}</loc>\n` +
          `    <lastmod>${u.lastmod}</lastmod>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n` +
          `    <priority>${u.priority}</priority>\n` +
          `  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
});
