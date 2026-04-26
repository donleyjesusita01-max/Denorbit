import { useEffect } from 'react';

interface JsonLdProps {
  /** Stable identifier so we can replace existing tags of the same kind on route changes. */
  id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Injects a JSON-LD <script> into <head>. Self-cleans on unmount and
 * replaces any prior tag with the same id so route transitions don't leak schemas.
 */
const JsonLd = ({ id, data }: JsonLdProps) => {
  useEffect(() => {
    const tagId = `jsonld-${id}`;
    let el = document.getElementById(tagId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = tagId;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      const existing = document.getElementById(tagId);
      if (existing) existing.remove();
    };
  }, [id, data]);

  return null;
};

export default JsonLd;
