'use client';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/5 rounded-full blur-3xl" />

        {/* Floating geometric symbols */}
        <div className="animate-float absolute top-20 left-[10%] text-violet-400/30 text-6xl select-none">⬡</div>
        <div className="animate-float-delayed absolute top-32 right-[15%] text-amber-400/20 text-5xl select-none">✦</div>
        <div className="animate-float-slow absolute bottom-40 left-[20%] text-violet-500/25 text-4xl select-none">◈</div>
        <div className="animate-float absolute top-1/2 right-[8%] text-violet-400/20 text-7xl select-none">△</div>
        <div className="animate-float-delayed absolute bottom-32 right-[25%] text-amber-400/15 text-5xl select-none">◎</div>
        <div className="animate-float-slow absolute top-[15%] left-[45%] text-violet-300/20 text-3xl select-none">⬟</div>
        <div className="animate-float absolute bottom-[20%] left-[5%] text-amber-500/20 text-4xl select-none">◆</div>
        <div className="animate-float-delayed absolute top-[60%] left-[30%] text-violet-400/15 text-5xl select-none">✧</div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 mb-8">
          <span className="text-violet-400 text-sm">✦</span>
          <span className="text-violet-300 text-sm font-medium">Premium Wissensplattform für spirituelle Entwicklung</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
          Erwecke dein{' '}
          <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
            verborgenes Wissen
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Entdecke transformative Kurse in Metaphysik, Quantenheilung, Astrologie und mehr.
          Über 6.000 Studierende haben bereits ihren spirituellen Pfad gefunden.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/login"
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/30 text-lg"
          >
            Jetzt starten ✦
          </Link>
          <Link
            href="/kurse"
            className="border border-[#2a2a3e] hover:border-violet-500 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-lg transition-all text-lg"
          >
            Kurse entdecken →
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">★★★★★</span>
            <span>4.9 / 5 Bewertung</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-violet-400">◎</span>
            <span>6.000+ Studierende</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-violet-400">◈</span>
            <span>30 Tage Geld-zurück-Garantie</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}
