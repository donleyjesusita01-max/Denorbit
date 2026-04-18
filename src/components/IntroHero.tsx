import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Wrench, BookOpen, Layers } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

const HIGHLIGHTS = [
  { icon: Layers, label: 'Honest theme reviews' },
  { icon: Wrench, label: 'Plugin deep-dives' },
  { icon: BookOpen, label: 'Build tutorials' },
  { icon: Sparkles, label: 'Hand-picked templates' },
];

const IntroHero = () => {
  return (
    <section className="container-blog py-20 md:py-28 border-b border-border">
      <div className="max-w-3xl">
        <p className="section-eyebrow inline-flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          PixelCritic — digital products, reviewed
        </p>

        <h1 className="featured-title mt-5">
          We test the <span className="italic text-accent">themes, plugins & templates</span> you're about to buy — so you don't have to.
        </h1>

        <p className="mt-6 text-lg text-muted-foreground leading-relaxed font-sans max-w-2xl">
          Independent, hands-on reviews of digital products for WordPress, Shopify, Framer, and Webflow.
          No affiliate fluff, no scorecards inflated by sponsorships — just the verdict from people who actually shipped sites with them.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="group">
            <Link to="/posts">
              Browse all reviews
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/about">What we do</Link>
          </Button>
        </div>

        <ul className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 text-sm text-foreground/80 border-l border-accent/40 pl-3"
            >
              <Icon className="h-4 w-4 text-accent shrink-0" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default IntroHero;
