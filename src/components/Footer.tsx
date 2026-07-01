export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h4 className="text-lg font-black mb-3">
              Roots<span style={{ color: '#FF1675' }}>Tech</span>News
            </h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Technology news from Africa, the Caribbean, and South America.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider mb-3 text-white/80">Sections</h5>
            <ul className="space-y-2 text-sm text-white/60">
              {['AI', 'Startups', 'Coding', 'Design', 'Science', 'Policy'].map(s => (
                <li key={s}><a href="#" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider mb-3 text-white/80">Regions</h5>
            <ul className="space-y-2 text-sm text-white/60">
              {['Africa', 'Caribbean', 'South America', 'Global'].map(r => (
                <li key={r}><a href="#" className="hover:text-white transition-colors">{r}</a></li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider mb-3 text-white/80">Company</h5>
            <ul className="space-y-2 text-sm text-white/60">
              {['About', 'Contact', 'Newsletter', 'RSS Feed', 'Privacy'].map(c => (
                <li key={c}><a href="#" className="hover:text-white transition-colors">{c}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/40">
          RootsTechNews. Technology news from underrepresented regions.
        </div>
      </div>
    </footer>
  );
}