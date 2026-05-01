import { ShieldCheck, Hammer, HeartHandshake, Eye } from 'lucide-react';

const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'No paid placements',
    body: 'Verdicts are never for sale. If we love it, we say so. If we don’t, we say that too.',
  },
  {
    icon: Hammer,
    title: 'Built with it, not just looked at',
    body: 'We ship real sites with every product before writing a single line of review.',
  },
  {
    icon: Eye,
    title: 'Transparent rubric',
    body: 'Every score breaks down design, performance, support, docs and value — visibly.',
  },
  {
    icon: HeartHandshake,
    title: 'Made for makers',
    body: 'Written by designers and developers — for the people actually launching the things.',
  },
];

const WhyUs = () => {
  return (
    <section className="container-blog py-14 md:py-20 border-t border-border">
      <div className="max-w-2xl mb-10 md:mb-14">
        <p className="section-eyebrow">Why Denorbit</p>
        <h2 className="section-title mb-3">Reviews you can actually trust.</h2>
        <p className="text-muted-foreground leading-relaxed">
          We’re a tiny independent team that genuinely uses every product we cover. No fluff, no
          influencer scripts — just the honest stuff a friend would tell you before you click buy.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="group relative bg-card border border-border p-5 md:p-6 hover:border-accent/60 transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1.5 tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyUs;
