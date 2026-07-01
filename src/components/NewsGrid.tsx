import type { Article } from '@/services/newsService';
import NewsCard from './NewsCard';

interface NewsGridProps {
  articles: Article[];
  title?: string;
}

export default function NewsGrid({ articles, title }: NewsGridProps) {
  return (
    <section className="py-8 lg:py-12">
      {title && (
        <h2 className="text-xl font-black text-[#1A1A2E] mb-6">{title}</h2>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <NewsCard
            key={`${article.link}-${i}`}
            article={article}
            variant={i === 0 ? 'large' : 'default'}
          />
        ))}
      </div>
    </section>
  );
}

export function NewsGridSkeleton() {
  return (
    <section className="py-8 lg:py-12">
      <div className="skeleton h-8 w-48 rounded-lg mb-6" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[16/10] rounded-xl mb-3" />
            <div className="skeleton h-4 w-20 rounded-full mb-2" />
            <div className="skeleton h-5 w-full rounded mb-1.5" />
            <div className="skeleton h-5 w-3/4 rounded mb-1.5" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}