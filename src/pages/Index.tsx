import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IntroHero from '@/components/IntroHero';
import CategoryShowcase from '@/components/CategoryShowcase';
import BlogGrid from '@/components/BlogGrid';
import FAQSection from '@/components/FAQSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <IntroHero />
        <CategoryShowcase />
        <BlogGrid />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

