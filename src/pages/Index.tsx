import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DefaultFeaturedArticle } from '@/components/FeaturedArticle';
import CategoryShowcase from '@/components/CategoryShowcase';
import BlogGrid from '@/components/BlogGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <DefaultFeaturedArticle />
        <CategoryShowcase />
        <BlogGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
