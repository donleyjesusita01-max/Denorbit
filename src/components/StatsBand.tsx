import { Coffee, Users, FileText, Star } from 'lucide-react';

const STATS = [
  { icon: FileText, value: '120+', label: 'Reviews published' },
  { icon: Users, value: '2.5k', label: 'Weekly readers' },
  { icon: Star, value: '4.8/5', label: 'Avg. reader rating' },
  { icon: Coffee, value: '600+', label: 'Hours testing' },
];

const StatsBand = () => {
  return (
    <section className="container-blog py-10 md:py-14 border-t border-border">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="group relative bg-card border border-border p-5 md:p-6 flex flex-col items-start gap-2 hover:border-accent/60 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Icon className="h-5 w-5 text-accent" />
            <div className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              {value}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground leading-snug">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBand;
