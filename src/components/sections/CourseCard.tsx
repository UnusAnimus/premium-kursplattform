'use client';
import Link from 'next/link';
import type { Course } from '@/lib/types';
import { formatPrice, formatDuration } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl overflow-hidden hover:bg-[var(--bg-surface-hover)] hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] flex flex-col">
      {/* Image area */}
      <div className="relative aspect-video overflow-hidden bg-[var(--bg-surface-raised)] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_45%)]" />
        <span className="relative z-10 text-6xl opacity-60 text-[var(--badge-brand-text)]">
          {course.category === 'Metaphysik' ? '∞' :
           course.category === 'Heilung' ? '✦' :
           course.category === 'Astrologie' ? '☽' :
           course.category === 'Hermetik' ? '⚗' :
           course.category === 'Traumarbeit' ? '◈' : '⬡'}
        </span>
        <span className="absolute top-3 left-3 brand-chip text-xs font-medium px-2.5 py-1 rounded-full">
          {course.category}
        </span>
        <span className="absolute top-3 right-3 bg-[var(--bg-surface)]/90 text-[var(--text-secondary)] text-xs px-2.5 py-1 rounded-full border border-[var(--border-base)] backdrop-blur-sm">
          {course.level}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[var(--text-primary)] text-base mb-1 leading-snug">{course.title}</h3>
        <p className="text-[var(--text-muted)] text-xs mb-3">von {course.instructor}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-amber-400 text-sm">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={star <= Math.round(course.rating) ? 'text-amber-400' : 'text-[var(--border-strong)]'}>★</span>
            ))}
          </div>
          <span className="text-amber-400 text-sm font-medium">{course.rating}</span>
          <span className="text-[var(--text-muted)] text-xs">({course.reviewsCount})</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-4">
          <span>🕐 {formatDuration(course.duration)}</span>
          <span>◈ {course.lessonsCount} Lektionen</span>
          {course.certificate && <span className="text-[var(--badge-brand-text)]">◆ Zertifikat</span>}
        </div>

        {/* Price & CTA */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-[var(--text-primary)] font-bold text-xl">{formatPrice(course.price)}</span>
            {course.originalPrice && (
              <span className="text-[var(--text-muted)] text-sm line-through ml-2">{formatPrice(course.originalPrice)}</span>
            )}
          </div>
          <Link
            href={`/kurse/${course.slug}`}
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Entdecken →
          </Link>
        </div>
      </div>
    </div>
  );
}
