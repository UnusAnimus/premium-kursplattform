'use client';
import Link from 'next/link';
import type { Course } from '@/lib/types';
import { formatPrice, formatDuration } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 flex flex-col">
      {/* Image area */}
      <div className="relative aspect-video bg-gradient-to-br from-violet-900/40 to-amber-900/20 flex items-center justify-center">
        <span className="text-6xl opacity-40">
          {course.category === 'Metaphysik' ? '∞' :
           course.category === 'Heilung' ? '✦' :
           course.category === 'Astrologie' ? '☽' :
           course.category === 'Hermetik' ? '⚗' :
           course.category === 'Traumarbeit' ? '◈' : '⬡'}
        </span>
        <span className="absolute top-3 left-3 bg-violet-500/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {course.category}
        </span>
        <span className="absolute top-3 right-3 bg-[#13131a]/80 text-slate-300 text-xs px-2.5 py-1 rounded-full border border-[#1e1e2e]">
          {course.level}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-white text-base mb-1 leading-snug">{course.title}</h3>
        <p className="text-slate-500 text-xs mb-3">von {course.instructor}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-amber-400 text-sm">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={star <= Math.round(course.rating) ? 'text-amber-400' : 'text-slate-600'}>★</span>
            ))}
          </div>
          <span className="text-amber-400 text-sm font-medium">{course.rating}</span>
          <span className="text-slate-500 text-xs">({course.reviewsCount})</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span>🕐 {formatDuration(course.duration)}</span>
          <span>◈ {course.lessonsCount} Lektionen</span>
          {course.certificate && <span className="text-violet-400">◆ Zertifikat</span>}
        </div>

        {/* Price & CTA */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-white font-bold text-xl">{formatPrice(course.price)}</span>
            {course.originalPrice && (
              <span className="text-slate-500 text-sm line-through ml-2">{formatPrice(course.originalPrice)}</span>
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
