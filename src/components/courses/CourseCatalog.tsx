'use client';

import { useState } from 'react';
import type { Course } from '@/lib/types';
import { CourseCard } from '@/components/sections/CourseCard';

interface CourseCatalogProps {
  courses: Course[];
}

export function CourseCatalog({ courses }: CourseCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const [selectedLevel, setSelectedLevel] = useState('alle');

  const categories = ['alle', ...Array.from(new Set(courses.map(course => course.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'alle' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'alle' || course.level === selectedLevel;
    return matchesCategory && matchesLevel;
  });

  return (
    <div className="bg-[var(--bg-base)] min-h-screen">
      <div className="border-b border-[var(--border-base)] bg-[var(--bg-surface-raised)]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 brand-chip rounded-full px-4 py-2 mb-6">
            <span className="text-sm">◈</span>
            <span className="text-sm font-medium">Unsere Kurse</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
            Premium{' '}
            <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
              Kurse & Lehrpfade
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
            Entdecke unsere handverlesenen Kurse von Experten in Metaphysik, Heilung, Astrologie und mehr.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <span className="text-[var(--text-secondary)] text-sm py-2">Kategorie:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-violet-600 text-white'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] hover:border-violet-500'
                }`}
              >
                {category === 'alle' ? 'Alle' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-10">
          <span className="text-[var(--text-secondary)] text-sm py-2">Niveau:</span>
          {['alle', 'Anfänger', 'Fortgeschritten', 'Experte'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLevel === level
                  ? 'bg-amber-600 text-white'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] hover:border-amber-500'
              }`}
            >
              {level === 'alle' ? 'Alle Niveaus' : level}
            </button>
          ))}
        </div>

        <p className="text-[var(--text-muted)] text-sm mb-8">
          {filteredCourses.length} Kurs{filteredCourses.length !== 1 ? 'e' : ''} gefunden
        </p>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4 opacity-30">◈</div>
            <p className="text-[var(--text-secondary)]">Keine Kurse für diese Filter gefunden.</p>
          </div>
        )}
      </div>
    </div>
  );
}