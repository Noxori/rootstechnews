export interface Article {
  title: string;
  link: string;
  excerpt: string;
  image?: string;
  source: string;
  category: string;
  publishedAt: string;
}

const FEEDS = [
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', category: 'tech' },
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'startups' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica', category: 'science' },
  { url: 'https://techcabal.com/feed/', source: 'TechCabal', category: 'startups' },
  { url: 'https://technext24.com/feed/', source: 'Technext', category: 'startups' },
  { url: 'https://restofworld.org/feed/', source: 'Rest of World', category: 'tech' },
];

const CATEGORY_MAP: Record<string, string> = {
  ai: 'AI',
  'artificial intelligence': 'AI',
  machine: 'AI',
  startup: 'Startups',
  venture: 'Startups',
  funding: 'Startups',
  code: 'Coding',
  software: 'Coding',
  developer: 'Coding',
  design: 'Design',
  hardware: 'Hardware',
  gadget: 'Hardware',
  science: 'Science',
  research: 'Science',
  policy: 'Policy',
  regulation: 'Policy',
  crypto: 'Crypto',
  blockchain: 'Crypto',
};

const FALLBACK_ARTICLES: Article[] = [
  {
    title: 'AI Revolution Sweeps Across Africa and the Caribbean',
    link: '#',
    excerpt: 'From Lagos to Kingston, a new wave of AI startups is transforming industries and creating opportunities in emerging markets worldwide.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    source: 'RootsTechNews',
    category: 'AI',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'South America\'s Booming Fintech Scene Draws Global Attention',
    link: '#',
    excerpt: 'São Paulo and Buenos Aires lead a fintech revolution as venture capital pours into Latin American payment and banking startups.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    source: 'RootsTechNews',
    category: 'Startups',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    title: 'Open Source Tools Empowering the Next Generation of Caribbean Developers',
    link: '#',
    excerpt: 'Community-driven coding initiatives across the Caribbean are building a pipeline of tech talent with free and open tools.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    source: 'RootsTechNews',
    category: 'Coding',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    title: 'African Tech Hubs Are Redefining Innovation on the Global Stage',
    link: '#',
    excerpt: 'Kenya, Nigeria, and South Africa lead a tech renaissance as homegrown solutions tackle local challenges with global implications.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    source: 'RootsTechNews',
    category: 'Startups',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    title: 'The Rise of Remote Work Is Reshaping Caribbean Economies',
    link: '#',
    excerpt: 'Digital nomads and remote tech workers are bringing new opportunities — and challenges — to island nations across the Caribbean.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fc55f?w=800',
    source: 'RootsTechNews',
    category: 'Policy',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    title: 'Latin America\'s Clean Energy Tech Boom Takes Center Stage',
    link: '#',
    excerpt: 'From solar farms in Chile to wind power in Brazil, Latin America is emerging as a leader in renewable energy technology.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
    source: 'RootsTechNews',
    category: 'Science',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
  },
];

function detectCategory(title: string, sourceCat: string): string {
  const text = title.toLowerCase();
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (text.includes(key)) return value;
  }
  const defaultMap: Record<string, string> = {
    tech: 'Tech', startups: 'Startups', science: 'Science', ai: 'AI',
    coding: 'Coding', design: 'Design',
  };
  return defaultMap[sourceCat] || 'Tech';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

async function fetchFeed(url: string): Promise<Article[]> {
  try {
    // Use CORS proxy for dev; in production, use a backend or Cloudflare Worker
    const proxy = 'https://api.allorigins.win/raw?url=';
    const res = await fetch(`${proxy}${encodeURIComponent(url)}`);
    const xml = await res.text();

    const items: { title: string; link: string; description: string; pubDate: string; enclosure?: { url: string } }[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1];
      const title = block.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1] || '';
      const link = block.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/)?.[1] || '#';
      const description = block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] || '';
      const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const imgMatch = block.match(/<media:content[^>]*url=["']([^"']+)["']/) || block.match(/<enclosure[^>]*url=["']([^"']+)["']/);
      items.push({
        title, link, description, pubDate,
        enclosure: imgMatch ? { url: imgMatch[1] } : undefined,
      });
    }
    return items.slice(0, 5).map(item => ({
      title: item.title || 'Untitled',
      link: item.link || '#',
      excerpt: stripHtml(item.description).slice(0, 200) + '...',
      image: item.enclosure?.url,
      source: url.includes('theverge') ? 'The Verge' :
             url.includes('techcrunch') ? 'TechCrunch' :
             url.includes('arstechnica') ? 'Ars Technica' :
             url.includes('techcabal') ? 'TechCabal' :
             url.includes('technext') ? 'Technext' : 'Rest of World',
      category: detectCategory(item.title || '', 'tech'),
      publishedAt: item.pubDate || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function fetchAllNews(): Promise<Article[]> {
  const results: Article[] = [];
  const feedResults = await Promise.allSettled(FEEDS.map(f => fetchFeed(f.url)));
  for (const result of feedResults) {
    if (result.status === 'fulfilled') results.push(...result.value);
  }
  if (results.length === 0) return FALLBACK_ARTICLES;
  return results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFallbackArticles(): Article[] {
  return FALLBACK_ARTICLES;
}