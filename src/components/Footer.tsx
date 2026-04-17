import { Link } from 'react-router-dom';
import { CATEGORIES, PLATFORMS } from '@/lib/categories';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-16" role="contentinfo">
      <div className="container-blog py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Pixel<span className="text-accent italic">Critic</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Honest, in-depth reviews of digital products and themes — written by people who actually ship with them.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Categories</h3>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link to={`/category/${c.slug}`} className="text-muted-foreground hover:text-accent transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Platforms</h3>
            <ul className="space-y-2 text-sm">
              {PLATFORMS.filter((p) => p.slug !== 'other').map((p) => (
                <li key={p.slug}>
                  <Link to={`/platform/${p.slug}`} className="text-muted-foreground hover:text-accent transition-colors">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Site</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-accent transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-accent transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-accent transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} PixelCritic. Independent reviews. No paid placements.</p>
          <p className="text-xs text-muted-foreground italic font-display">Made with care, not algorithms.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
