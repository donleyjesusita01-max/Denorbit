import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'What is Denorbit?',
    a: 'Denorbit is an independent review site for digital products — themes, plugins, templates, and tutorials for WordPress, Shopify, Framer, and Webflow. We test what we publish.',
  },
  {
    q: 'Do you accept paid reviews or sponsorships?',
    a: "No. Every review is unsponsored. We don't take payment from product creators in exchange for coverage, scores, or placement. If a piece is ever sponsored, it will be clearly labelled.",
  },
  {
    q: 'How do you choose which products to review?',
    a: "We pick products that real makers are buying — based on community demand, our own builds, and reader requests. We prioritise products people are actively considering, not just the newest releases.",
  },
  {
    q: 'How do you actually test a theme or plugin?',
    a: "We install it on a real site, configure it from scratch, push it with realistic content, run performance and accessibility audits, and use it for a meaningful build. No screenshot reviews.",
  },
  {
    q: 'Are your scores based on a fixed rubric?',
    a: "Yes. We weigh design quality, customisability, performance, support, documentation, and value. The exact criteria appear at the bottom of each review.",
  },
  {
    q: 'Do you use affiliate links?',
    a: "Sometimes — and we say so when we do. Affiliate revenue never changes a verdict; if a product is bad, we say so even when it pays the best commission.",
  },
  {
    q: 'How often do you publish new reviews?',
    a: "Multiple deep-dives every month, plus shorter tutorials and quick takes. Subscribe to the newsletter to get notified.",
  },
  {
    q: 'Can I request a product review?',
    a: 'Absolutely. Send us a request via the contact page. If enough readers ask about the same product, it jumps the queue.',
  },
  {
    q: 'Do you review products outside the listed platforms?',
    a: "Occasionally. If a product sits in our world (no-code, web design, content) and is widely used, we'll consider it.",
  },
  {
    q: 'How can I get in touch?',
    a: 'Use the Contact page for review requests, corrections, partnership inquiries, or general feedback. We read everything.',
  },
];

const FAQSection = () => {
  return (
    <section className="container-blog py-16 md:py-20 border-t border-border">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
        <div>
          <p className="section-eyebrow inline-flex items-center gap-2">
            <HelpCircle className="h-3.5 w-3.5" /> Questions
          </p>
          <h2 className="section-title mb-4">Frequently asked.</h2>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            Everything you might want to know about how Denorbit works, how we review, and how to
            get involved.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border">
              <AccordionTrigger className="text-left font-display text-lg md:text-xl font-semibold text-foreground hover:no-underline hover:text-accent py-5">
                <span className="flex items-baseline gap-4">
                  <span className="text-xs font-mono text-accent w-6 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{item.q}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base pl-10 pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
