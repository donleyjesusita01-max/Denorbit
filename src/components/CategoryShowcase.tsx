import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/lib/categories';
import { ArrowUpRight } from 'lucide-react';

const COLORS = [
  'from-accent/20 to-accent/5',
  'from-secondary to-background',
  'from-accent/10 to-secondary',
  'from-secondary/80 to-background',
];

const CategoryShowcase = () => {
  return (
    <section className="container-blog py-16 border-t border-border">
      <p className="section-eyebrow">Browse</p>
      <h2 className="section-title">Explore by category</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((c, i) => (
          <Link
            key={c.slug}
            to={`/category/${c.slug}`}
            className={`group relative overflow-hidden bg-gradient-to-br ${COLORS[i % COLORS.length]} border border-border p-8 min-h-[180px] flex flex-col justify-between transition-all hover:shadow-soft hover:-translate-y-0.5`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              0{i + 1}
            </span>
            <div className="flex items-end justify-between">
              <h3 className="font-display text-2xl font-semibold tracking-tight group-hover:text-accent transition-colors">
                {c.label}
              </h3>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:rotate-12 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
