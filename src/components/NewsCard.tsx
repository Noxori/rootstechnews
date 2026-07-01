import type { Article } from '@/services/newsService';

interface NewsCardProps {
  article: Article;
  variant?: 'default' | 'large' | 'compact';
}

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  const timeAgo = getTimeAgo(article.publishedAt);

  if (variant === 'large') {
    return (
      <article className="article-card group cursor-pointer">
        {article.image && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#F8F8FA] mb-4">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}
        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3 tag-${article.category.toLowerCase()}`}>
          {article.category}
        </span>
        <h3 className="article-title text-lg sm:text-xl font-bold leading-tight text-[#1A1A2E] mb-2 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-[#6B6B7B] leading-relaxed mb-3 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-[#6B6B7B]">
          <span className="font-semibold text-[#1A1A2E]">{article.source}</span>
          <span>·</span>
          <span>{timeAgo}</span>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="article-card group cursor-pointer flex gap-4 py-4 border-b border-[#E5E5E9] last:border-0">
        <div className="flex-1 min-w-0">
          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2 tag-${article.category.toLowerCase()}`}>
            {article.category}
          </span>
          <h4 className="article-title text-sm font-semibold leading-snug text-[#1A1A2E] mb-1 transition-colors line-clamp-2">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-[#6B6B7B]">
            <span className="font-semibold">{article.source}</span>
            <span>·</span>
            <span>{timeAgo}</span>
          </div>
        </div>
        {article.image && (
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F8F8FA] shrink-0">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </article>
    );
  }

  return (
    <article className="article-card group cursor-pointer">
      {article.image && (
        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#F8F8FA] mb-3">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold mb-2 tag-${article.category.toLowerCase()}`}>
        {article.category}
      </span>
      <h3 className="article-title text-base font-bold leading-snug text-[#1A1A2E] mb-1.5 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <div className="flex items-center gap-2 text-xs text-[#6B6B7B]">
        <span className="font-semibold">{article.source}</span>
        <span>·</span>
        <span>{timeAgo}</span>
      </div>
    </article>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}