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
  { path: '/api/rss/theverge', source: 'The Verge', category: 'tech' },
  { path: '/api/rss/techcrunch', source: 'TechCrunch', category: 'startups' },
  { path: '/api/rss/arstechnica', source: 'Ars Technica', category: 'science' },
  { path: '/api/rss/techcabal', source: 'TechCabal', category: 'startups' },
  { path: '/api/rss/technext', source: 'Technext', category: 'startups' },
  { path: '/api/rss/restofworld', source: 'Rest of World', category: 'tech' },
];

const CATEGORY_MAP: Record<string, string> = {
  ai: 'AI', 'artificial intelligence': 'AI', machine: 'AI', llm: 'AI', gpt: 'AI',
  startup: 'Startups', venture: 'Startups', funding: 'Startups', raises: 'Startups',
  code: 'Coding', software: 'Coding', developer: 'Coding', programming: 'Coding',
  design: 'Design',
  hardware: 'Hardware', gadget: 'Hardware', device: 'Hardware', phone: 'Hardware',
  science: 'Science', research: 'Science', study: 'Science', space: 'Science',
  policy: 'Policy', regulation: 'Policy', law: 'Policy', ban: 'Policy', court: 'Policy',
  crypto: 'Crypto', blockchain: 'Crypto', bitcoin: 'Crypto',
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
    title: 'Open Source Tools Empowering Caribbean Developers',
    link: '#',
    excerpt: 'Community-driven coding initiatives across the Caribbean are building a pipeline of tech talent with free and open tools.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    source: 'RootsTechNews',
    category: 'Coding',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    title: 'African Tech Hubs Redefine Innovation on the Global Stage',
    link: '#',
    excerpt: 'Kenya, Nigeria, and South Africa lead a tech renaissance as homegrown solutions tackle local challenges with global implications.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    source: 'RootsTechNews',
    category: 'Startups',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    title: 'Remote Work Is Reshaping Caribbean Economies',
    link: '#',
    excerpt: 'Digital nomads and remote tech workers are bringing new opportunities — and challenges — to island nations.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fc55f?w=800',
    source: 'RootsTechNews',
    category: 'Policy',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    title: 'Latin America\'s Clean Energy Tech Boom',
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

async function fetchFeed(path: string): Promise<Article[]> {
  try {
    const res = await fetch(path);
    if (!res.ok) return [];
    const xml = await res.text();

    // Try RSS <item> format first
    const rssItems = parseRSSItems(xml, path);
    if (rssItems.length > 0) return rssItems;

    // Try Atom <entry> format
    return parseAtomEntries(xml, path);
  } catch {
    return [];
  }
}

function parseRSSItems(xml: string, path: string): Article[] {
  const items: { title: string; link: string; description: string; pubDate: string; img?: string }[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = (block.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1] || '').trim();
    const link = (block.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/)?.[1] || '#').trim();
    const description = block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] || '';
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    const descImgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/);
    const imgMatch = block.match(/<media:content[^>]*url=["']([^"']+)["']/)?.[1] ||
                     block.match(/<enclosure[^>]*url=["']([^"']+)["']/)?.[1] ||
                     descImgMatch?.[1];
    if (title) items.push({ title, link, description, pubDate, img: imgMatch });
  }
  if (items.length === 0) return [];
  return formatArticles(items, path);
}

function parseAtomEntries(xml: string, path: string): Article[] {
  const items: { title: string; link: string; description: string; pubDate: string; img?: string }[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = (block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1] || '').trim();
    const linkMatch = block.match(/<link[^>]*href=["']([^"']+)["']/);
    const link = linkMatch?.[1] || '#';
    const description = block.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/)?.[1] ||
                        block.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/)?.[1] || '';
    const pubDate = block.match(/<published>(.*?)<\/published>/)?.[1] ||
                    block.match(/<updated>(.*?)<\/updated>/)?.[1] || '';
    const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/)?.[1];
    if (title) items.push({ title, link, description, pubDate, img: imgMatch });
  }
  if (items.length === 0) return [];
  return formatArticles(items, path);
}

function formatArticles(items: { title: string; link: string; description: string; pubDate: string; img?: string }[], path: string): Article[] {
  return items.slice(0, 6).map(item => ({
    title: item.title,
    link: item.link,
    excerpt: stripHtml(item.description).slice(0, 200) + '...',
    image: item.img,
    source: path.includes('theverge') ? 'The Verge' : path.includes('techcrunch') ? 'TechCrunch' :
            path.includes('arstechnica') ? 'Ars Technica' : path.includes('techcabal') ? 'TechCabal' :
            path.includes('technext') ? 'Technext' : 'Rest of World',
    category: detectCategory(item.title, 'tech'),
    publishedAt: item.pubDate || new Date().toISOString(),
  }));
}

export async function fetchAllNews(): Promise<Article[]> {
  const results: Article[] = [];
  const feedResults = await Promise.allSettled(FEEDS.map(f => fetchFeed(f.path)));
  for (const result of feedResults) {
    if (result.status === 'fulfilled') results.push(...result.value);
  }
  if (results.length === 0) return FALLBACK_ARTICLES;
  return results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFallbackArticles(): Article[] {
  return FALLBACK_ARTICLES;
}