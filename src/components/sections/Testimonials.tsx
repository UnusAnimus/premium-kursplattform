import type { Testimonial } from '@/lib/types';
import { testimonials } from '@/lib/data';

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6 hover:border-violet-500/30 transition-all duration-300">
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= t.rating ? 'text-amber-400' : 'text-slate-600'}>★</span>
        ))}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>
      {t.courseTitle && (
        <p className="text-violet-400 text-xs font-medium mb-4">Kurs: {t.courseTitle}</p>
      )}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
          {t.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{t.name}</p>
          <p className="text-slate-500 text-xs">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <span className="text-amber-400 text-sm">★</span>
            <span className="text-amber-300 text-sm font-medium">Was unsere Studierenden sagen</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Echte Ergebnisse, echte{' '}
            <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
              Transformation
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tausende von Studierenden haben bereits ihren spirituellen Pfad mit uns gefunden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
