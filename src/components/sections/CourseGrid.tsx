import type { Course } from '@/lib/types';
import { CourseCard } from './CourseCard';

interface CourseGridProps {
  courses: Course[];
  title?: string;
  subtitle?: string;
}

export function CourseGrid({ courses, title, subtitle }: CourseGridProps) {
  return (
    <section className="py-24 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-4xl font-bold text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
