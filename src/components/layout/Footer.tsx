import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0a0a0f] border-t border-[#1e1e2e] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl text-violet-400">⬡</span>
              <span className="font-bold text-white text-lg">Arkanum Akademie</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Entdecke transformatives Wissen in Metaphysik, Bewusstseinsentwicklung und esoterischen Traditionen.
            </p>
            <div className="flex items-center gap-3">
              {['✦', '◈', '⬡'].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg border border-[#1e1e2e] flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-500 transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Kurse */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kurse</h3>
            <ul className="space-y-3">
              {[
                { href: '/kurse', label: 'Alle Kurse' },
                { href: '/kurse/metaphysik-bewusstsein', label: 'Metaphysik' },
                { href: '/kurse/astrologie-meisterkurs', label: 'Astrologie' },
                { href: '/kurse/quantenheilung', label: 'Heilung' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-violet-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Akademie */}
          <div>
            <h3 className="font-semibold text-white mb-4">Akademie</h3>
            <ul className="space-y-3">
              {[
                { href: '/ueber-uns', label: 'Über uns' },
                { href: '/preise', label: 'Preise' },
                { href: '/kontakt', label: 'Kontakt' },
                { href: '/dashboard', label: 'Mitgliederbereich' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-violet-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="font-semibold text-white mb-4">Rechtliches</h3>
            <ul className="space-y-3">
              {[
                { id: 'impressum', href: '#', label: 'Impressum' },
                { id: 'datenschutz', href: '#', label: 'Datenschutz' },
                { id: 'agb', href: '#', label: 'AGB' },
                { id: 'widerruf', href: '#', label: 'Widerruf' },
              ].map(link => (
                <li key={link.id}>
                  <Link href={link.href} className="text-slate-400 hover:text-violet-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1e1e2e] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {year} Arkanum Akademie. Alle Rechte vorbehalten.
          </p>
          <p className="text-slate-500 text-sm">
            Mit <span className="text-violet-400">✦</span> handgefertigt für Suchende
          </p>
        </div>
      </div>
    </footer>
  );
}
