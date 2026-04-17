export const CATEGORIES = [
  { slug: 'themes', label: 'Themes' },
  { slug: 'templates', label: 'Templates' },
  { slug: 'plugins', label: 'Plugins' },
  { slug: 'tutorials', label: 'Tutorials' },
] as const;

export const PLATFORMS = [
  { slug: 'wordpress', label: 'WordPress' },
  { slug: 'shopify', label: 'Shopify' },
  { slug: 'framer', label: 'Framer' },
  { slug: 'webflow', label: 'Webflow' },
  { slug: 'other', label: 'Other' },
] as const;

export type CategorySlug = typeof CATEGORIES[number]['slug'];
export type PlatformSlug = typeof PLATFORMS[number]['slug'];

export const categoryLabel = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

export const platformLabel = (slug: string) =>
  PLATFORMS.find((p) => p.slug === slug)?.label ?? slug;
