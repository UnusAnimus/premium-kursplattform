import { Prisma, type Level as PrismaLevel } from '@prisma/client';
import { courses as fallbackCourses } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import type { Course, Lesson, Level, Module } from '@/lib/types';

let hasLoggedPublicCourseFallback = false;

const publicCourseInclude = Prisma.validator<Prisma.CourseInclude>()({
  modules: {
    orderBy: { order: 'asc' },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
  },
  _count: {
    select: {
      enrollments: true,
    },
  },
});

type PublicCourseRecord = Prisma.CourseGetPayload<{
  include: typeof publicCourseInclude;
}>;

function mapLevel(level: PrismaLevel): Level {
  if (level === 'Anfaenger') {
    return 'Anfänger';
  }

  return level;
}

function mapLesson(lesson: PublicCourseRecord['modules'][number]['lessons'][number]): Lesson {
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    duration: lesson.durationMin,
    videoUrl: lesson.videoUrl ?? undefined,
    isFree: lesson.isFree,
    order: lesson.order,
  };
}

function mapModule(moduleRecord: PublicCourseRecord['modules'][number]): Module {
  return {
    id: moduleRecord.id,
    title: moduleRecord.title,
    description: moduleRecord.description,
    order: moduleRecord.order,
    lessons: moduleRecord.lessons.map(mapLesson),
  };
}

function calculateDuration(courseRecord: PublicCourseRecord): number {
  const lessonDuration = courseRecord.modules.reduce((total, moduleRecord) => {
    return total + moduleRecord.lessons.reduce((moduleTotal, lesson) => moduleTotal + lesson.durationMin, 0);
  }, 0);

  return lessonDuration > 0 ? lessonDuration : courseRecord.durationMinutes;
}

function calculateLessonsCount(courseRecord: PublicCourseRecord): number {
  const lessonCount = courseRecord.modules.reduce((total, moduleRecord) => total + moduleRecord.lessons.length, 0);
  return lessonCount > 0 ? lessonCount : courseRecord.lessonsCount;
}

export function mapPublicCourse(courseRecord: PublicCourseRecord): Course {
  return {
    id: courseRecord.id,
    slug: courseRecord.slug,
    title: courseRecord.title,
    description: courseRecord.description,
    longDescription: courseRecord.longDescription,
    instructor: courseRecord.instructor,
    instructorBio: courseRecord.instructorBio,
    duration: calculateDuration(courseRecord),
    lessonsCount: calculateLessonsCount(courseRecord),
    price: courseRecord.price,
    originalPrice: courseRecord.originalPrice ?? undefined,
    rating: courseRecord.rating,
    reviewsCount: courseRecord.reviewsCount,
    image: courseRecord.image ?? '',
    category: courseRecord.category,
    level: mapLevel(courseRecord.level),
    tags: courseRecord.tags,
    modules: courseRecord.modules.map(mapModule),
    studentsCount: Math.max(courseRecord.studentsCount, courseRecord._count.enrollments),
    language: courseRecord.language,
    certificate: courseRecord.certificate,
    featured: courseRecord.featured,
    createdAt: courseRecord.createdAt.toISOString(),
    updatedAt: courseRecord.updatedAt.toISOString(),
  };
}

function sortCourses(courses: Course[]): Course[] {
  return [...courses].sort((leftCourse, rightCourse) => {
    if (leftCourse.featured !== rightCourse.featured) {
      return Number(rightCourse.featured) - Number(leftCourse.featured);
    }

    return new Date(rightCourse.updatedAt).getTime() - new Date(leftCourse.updatedAt).getTime();
  });
}

function logPublicCourseFallback(error: unknown, operation: string) {
  if (hasLoggedPublicCourseFallback) {
    return;
  }

  hasLoggedPublicCourseFallback = true;
  console.error(`[publicCourses] Falling back to static course data during ${operation}.`, error);
}

async function withCourseFallback<T>(operation: string, query: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    logPublicCourseFallback(error, operation);
    return fallback();
  }
}

export async function getPublicCourses(): Promise<Course[]> {
  return withCourseFallback('getPublicCourses', async () => {
    const courses = await prisma.course.findMany({
      include: publicCourseInclude,
      orderBy: [
        { featured: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    return courses.map(mapPublicCourse);
  }, () => sortCourses(fallbackCourses));
}

export async function getFeaturedPublicCourses(limit = 3): Promise<Course[]> {
  return withCourseFallback('getFeaturedPublicCourses', async () => {
    const courses = await prisma.course.findMany({
      where: { featured: true },
      include: publicCourseInclude,
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    return courses.map(mapPublicCourse);
  }, () => sortCourses(fallbackCourses).filter(course => course.featured).slice(0, limit));
}

export async function getPublicCourseBySlug(slug: string): Promise<Course | null> {
  return withCourseFallback('getPublicCourseBySlug', async () => {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: publicCourseInclude,
    });

    if (!course) {
      return null;
    }

    return mapPublicCourse(course);
  }, () => fallbackCourses.find(course => course.slug === slug) ?? null);
}