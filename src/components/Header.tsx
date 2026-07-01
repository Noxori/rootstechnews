import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'News', href: '#news' },
  { label: 'AI', href: '#ai' },
  { label: 'Startups', href: '#startups' },
  { label: 'Coding', href: '#coding' },
  { label: 'Region', href: '#region' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-black tracking-tight text-[#1A1A2E]">
              Roots<span style={{ color: '#FF1675' }}>Tech</span>News
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors rounded-lg hover:bg-[#F8F8FA]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full transition-colors"
              style={{ backgroundColor: '#FF1675' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E6005C')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF1675')}
            >
              Newsletter
            </button>
            <button className="p-2 text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors rounded-lg hover:bg-[#F8F8FA]">
              <Search size={20} />
            </button>
            <button
              className="md:hidden p-2 text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-[#E5E5E9] pt-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-3 py-2 text-sm font-medium text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors rounded-lg hover:bg-[#F8F8FA]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}