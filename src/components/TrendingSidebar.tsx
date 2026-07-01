import type { Article } from '@/services/newsService';
import NewsCard from './NewsCard';

interface TrendingSidebarProps {
  articles: Article[];
}

export default function TrendingSidebar({ articles }: TrendingSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Trending */}
      <div className="bg-[#F8F8FA] rounded-2xl p-5">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1A2E] mb-4">
          Trending Now
        </h3>
        <div className="space-y-0">
          {articles.slice(0, 5).map((article, i) => (
            <div key={i}>
              <NewsCard article={article} variant="compact" />
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="rounded-2xl p-6 text-white text-center" style={{ background: 'linear-gradient(135deg, #FF1675, #8B5CF6)' }}>
        <h3 className="text-lg font-black mb-2">Stay in the loop</h3>
        <p className="text-sm text-white/80 mb-4 leading-relaxed">
          Weekly tech news from Africa, the Caribbean, and South America. Free, no spam.
        </p>
        <form className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-3 py-2 rounded-lg text-sm text-[#1A1A2E] bg-white placeholder-[#6B6B7B] border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-[#FF1675] bg-white hover:bg-white/90 transition-colors"
          >
            Join
          </button>
        </form>
      </div>
    </aside>
  );
}