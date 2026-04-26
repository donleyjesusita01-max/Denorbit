import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Wrench, BookOpen, Layers, Star } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: Layers, label: 'Honest theme reviews' },
  { icon: Wrench, label: 'Plugin deep-dives' },
  { icon: BookOpen, label: 'Build tutorials' },
  { icon: Sparkles, label: 'Hand-picked templates' },
];

const IntroHero = () => {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background flourishes */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            'radial-gradient(60% 80% at 85% 10%, hsl(var(--accent) / 0.18), transparent 60%), radial-gradient(50% 70% at 10% 90%, hsl(var(--accent) / 0.12), transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container-blog py-16 md:py-24 relative">
        {/* Floating accent badge — only on larger screens */}
        <div className="absolute top-8 right-6 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-[var(--shadow-soft)] animate-[float_6s_ease-in-out_infinite]">
          <Star className="h-3 w-3 text-accent fill-accent" />
          <span className="text-xs font-medium tracking-wide text-foreground">
            Reviewed, not sponsored
          </span>
        </div>

        <div className="max-w-3xl">
          <p className="section-eyebrow inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Denorbit — digital products, dissected
          </p>

          <h1 className="font-display font-semibold text-foreground tracking-tight leading-[1.1] mt-5 text-[2rem] sm:text-4xl md:text-[2.75rem] lg:text-5xl">
            We test the{' '}
            <span className="relative inline-block">
              <span className="italic text-accent">themes, plugins & templates</span>
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                className="absolute left-0 -bottom-1.5 w-full h-2.5 text-accent/60"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 Q 75 2, 150 7 T 298 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            you're about to buy — so you don't{' '}
            <span className="line-through text-muted-foreground/60">waste money</span>{' '}
            have to.
          </h1>

          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed font-sans max-w-2xl">
            Independent, hands-on reviews of digital products for{' '}
            <span className="text-foreground font-medium">WordPress</span>,{' '}
            <span className="text-foreground font-medium">Shopify</span>,{' '}
            <span className="text-foreground font-medium">Framer</span>, and{' '}
            <span className="text-foreground font-medium">Webflow</span>. No affiliate fluff, no
            inflated scorecards — just the verdict from people who've actually shipped sites with
            them.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="default" className="group h-11 px-6 shadow-[var(--shadow-lift)]">
              <Link to="/posts">
                Browse all reviews
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="default" className="h-11 px-6">
              <Link to="/about">What we do</Link>
            </Button>

            <div className="hidden sm:flex items-center gap-2 ml-1 pl-4 border-l border-border">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full bg-gradient-to-br from-accent to-accent/40 border-2 border-background"
                    style={{ transform: `rotate(${i * 4 - 6}deg)` }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-tight">
                <span className="block font-semibold text-foreground">2,500+ makers</span>
                read us weekly
              </p>
            </div>
          </div>

          <ul className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }, i) => (
              <li
                key={label}
                className="group flex items-center gap-2.5 text-sm text-foreground/80 border-l-2 border-accent/40 pl-3 hover:border-accent transition-colors"
                style={{ animation: `fadeUp 0.5s ease ${0.1 + i * 0.08}s both` }}
              >
                <Icon className="h-4 w-4 text-accent shrink-0 group-hover:scale-110 transition-transform" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default IntroHero;
