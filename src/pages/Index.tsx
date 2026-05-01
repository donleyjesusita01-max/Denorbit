import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IntroHero from '@/components/IntroHero';
import StatsBand from '@/components/StatsBand';
import CategoryShowcase from '@/components/CategoryShowcase';
import BlogGrid from '@/components/BlogGrid';
import WhyUs from '@/components/WhyUs';
import NewsletterCTA from '@/components/NewsletterCTA';
import FAQSection from '@/components/FAQSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <IntroHero />
        <StatsBand />
        <CategoryShowcase />
        <BlogGrid />
        <WhyUs />
        <NewsletterCTA />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

