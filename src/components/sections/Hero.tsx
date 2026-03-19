'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles, Users, BookOpen, Star } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-base)]">
      {/* Layer 1: Large gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/20 dark:bg-violet-600/15 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-amber-500/10 dark:bg-amber-500/08 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Layer 2: Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
        backgroundImage: 'linear-gradient(var(--border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)',
        backgroundSize: '64px 64px'
      }} />

      {/* Layer 3: Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-[15%] w-24 h-24 border border-violet-500/20 rounded-2xl rotate-12 animate-float opacity-40" />
        <div className="absolute bottom-32 left-[12%] w-16 h-16 border border-purple-400/20 rounded-full animate-float opacity-30" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-[8%] w-10 h-10 bg-violet-600/10 rounded-lg rotate-45 animate-float opacity-50" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-[10%] w-20 h-20 border border-amber-500/15 rounded-full animate-float opacity-30" style={{ animationDelay: '3s' }} />
      </div>

      {/* Layer 4: Central decorative sphere */}
      <div className="absolute top-[15%] right-[10%] hidden lg:block pointer-events-none">
        <div className="relative w-48 h-48 opacity-30 dark:opacity-20">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 blur-sm" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-300/50 to-purple-600/30 backdrop-blur-sm" />
          <div className="absolute inset-0 rounded-full border border-violet-400/30" />
          <div className="absolute -inset-4 rounded-full border border-violet-400/10" />
          <div className="absolute -inset-8 rounded-full border border-violet-400/05" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-violet-500/20 mb-8 animate-reveal-fade">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">Premium Spirituelle Bildung</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-reveal-up">
          <span className="text-[var(--text-primary)]">Entfalte dein</span>{' '}
          <span className="gradient-text">spirituelles</span>
          <br />
          <span className="text-[var(--text-primary)]">Potenzial</span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-xl text-[var(--text-secondary)] mb-10 leading-relaxed animate-reveal-up delay-100">
          Tiefe Weisheitslehren, transformative Praktiken und eine gleichgesinnte Gemeinschaft —
          alles an einem Ort. Beginne deine Reise zur inneren Erleuchtung.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-reveal-up delay-200">
          <Link href="#preise">
            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-8 py-4 text-base shadow-lg hover:shadow-violet-500/30 w-full sm:w-auto">
              Jetzt beginnen
            </Button>
          </Link>
          <Link href="#kurse">
            <Button variant="outline" size="lg" className="px-8 py-4 text-base glass border-[var(--border-strong)] text-[var(--text-primary)] hover:border-violet-500/50 w-full sm:w-auto">
              Kurse entdecken
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-muted)] animate-reveal-up delay-300">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            <span>2.400+ Mitglieder</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span>50+ Premium-Kurse</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>4.9/5 Bewertung</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-reveal-fade delay-500">
        <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">Entdecken</span>
        <ChevronDown className="w-4 h-4 text-[var(--text-muted)] animate-bounce" />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-base)] to-transparent pointer-events-none" />
    </section>
  );
}

