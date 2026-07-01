import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import NewsGrid, { NewsGridSkeleton } from '@/components/NewsGrid';
import TrendingSidebar from '@/components/TrendingSidebar';
import Footer from '@/components/Footer';
import type { Article } from '@/services/newsService';
import { fetchAllNews, getFallbackArticles } from '@/services/newsService';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const data = await fetchAllNews();
      if (!cancelled) {
        setArticles(data);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const heroArticle = articles[0] || getFallbackArticles()[0];
  const mainArticles = loading ? [] : articles.slice(1, 13);
  const trendingArticles = loading ? getFallbackArticles() : articles.slice(6, 12);
  const aiArticles = articles.filter(a => a.category === 'AI').slice(0, 3);
  const startupArticles = articles.filter(a => a.category === 'Startups').slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="skeleton h-10 w-64 rounded-lg mb-4" />
          <div className="skeleton h-6 w-96 rounded-lg mb-8" />
          <div className="skeleton aspect-[21/9] rounded-2xl mb-12" />
          <NewsGridSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero article={heroArticle} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content + sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main feed */}
          <div className="flex-1 min-w-0">
            <NewsGrid articles={mainArticles} title="Latest Stories" />
            {aiArticles.length > 0 && (
              <NewsGrid articles={aiArticles} title="Artificial Intelligence" />
            )}
            {startupArticles.length > 0 && (
              <NewsGrid articles={startupArticles} title="Startups & Innovation" />
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-20">
              <TrendingSidebar articles={trendingArticles} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}