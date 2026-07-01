import type { Article } from '@/services/newsService';

interface HeroProps {
  article: Article;
}

export default function Hero({ article }: HeroProps) {
  const timeAgo = getTimeAgo(article.publishedAt);

  return (
    <section className="relative bg-white border-b border-[#E5E5E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 tag-${article.category.toLowerCase()}`}>
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight text-[#1A1A2E] mb-4">
              {article.title}
            </h1>
            <p className="text-base sm:text-lg text-[#6B6B7B] leading-relaxed mb-6">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-[#6B6B7B]">
              <span className="font-semibold text-[#1A1A2E]">{article.source}</span>
              <span aria-hidden="true">·</span>
              <span>{timeAgo}</span>
            </div>
          </div>

          {/* Image */}
          {article.image && (
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#F8F8FA]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
            </div>
          )}
        </div>
      </div>
    </section>
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