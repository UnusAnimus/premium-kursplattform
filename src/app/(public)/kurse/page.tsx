'use client';
import { useState } from 'react';
import { courses, categories } from '@/lib/data';
import { CourseCard } from '@/components/sections/CourseCard';

export default function KursePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const [selectedLevel, setSelectedLevel] = useState('alle');

  const filtered = courses.filter(course => {
    const matchCat = selectedCategory === 'alle' || course.category === selectedCategory;
    const matchLevel = selectedLevel === 'alle' || course.level === selectedLevel;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      course.title.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q) ||
      course.instructor.toLowerCase().includes(q) ||
      course.category.toLowerCase().includes(q);
    return matchCat && matchLevel && matchSearch;
  });

  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Header */}
      <div className="border-b border-[#1e1e2e] bg-[#13131a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
            <span className="text-violet-400 text-sm">◈</span>
            <span className="text-violet-300 text-sm font-medium">Unsere Kurse</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Premium{' '}
            <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
              Kurse & Lehrpfade
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-8">
            Entdecke unsere handverlesenen Kurse von Experten in Metaphysik, Heilung, Astrologie und mehr.
          </p>
          {/* Search field */}
          <div className="relative max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Kurse durchsuchen…"
              className="w-full pl-11 pr-4 py-3 bg-[#13131a] border border-[#1e1e2e] focus:border-violet-500/60 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <span className="text-slate-400 text-sm py-2">Kategorie:</span>
            {['alle', ...categories.map(c => c.name)].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white'
                    : 'bg-[#13131a] border border-[#1e1e2e] text-slate-400 hover:text-white hover:border-violet-500'
                }`}
              >
                {cat === 'alle' ? 'Alle' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-10">
          <span className="text-slate-400 text-sm py-2">Niveau:</span>
          {['alle', 'Anfänger', 'Fortgeschritten', 'Experte'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLevel === level
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#13131a] border border-[#1e1e2e] text-slate-400 hover:text-white hover:border-amber-500'
              }`}
            >
              {level === 'alle' ? 'Alle Niveaus' : level}
            </button>
          ))}
        </div>

        <p className="text-slate-500 text-sm mb-8">{filtered.length} Kurs{filtered.length !== 1 ? 'e' : ''} gefunden</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4 opacity-30">◈</div>
            <p className="text-slate-400 mb-2">Keine Kurse für diese Suche gefunden.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-violet-400 hover:text-violet-300 text-sm underline transition-colors"
              >
                Suche zurücksetzen
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
