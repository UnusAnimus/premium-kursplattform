import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/** GET /api/enrollments – returns enrollments for the current user */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }

  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            instructor: true,
            category: true,
            level: true,
            lessonsCount: true,
            modules: {
              select: {
                lessons: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    // Fetch completions for all lessons across all enrolled courses
    const allLessonIds = enrollments.flatMap(e =>
      e.course.modules.flatMap(m => m.lessons.map(l => l.id))
    );
    const completions = await prisma.lessonCompletion.findMany({
      where: { userId: session.user.id, lessonId: { in: allLessonIds } },
      select: { lessonId: true },
    });
    const completedSet = new Set(completions.map(c => c.lessonId));

    const result = enrollments.map(e => {
      const totalLessons = e.course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      const completedLessons = e.course.modules.reduce(
        (sum, m) => sum + m.lessons.filter(l => completedSet.has(l.id)).length,
        0
      );
      return {
        id: e.id,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
        course: {
          id: e.course.id,
          slug: e.course.slug,
          title: e.course.title,
          description: e.course.description,
          instructor: e.course.instructor,
          category: e.course.category,
          level: e.course.level,
          lessonsCount: totalLessons,
        },
        completedLessons,
        progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      };
    });

    return NextResponse.json({ enrollments: result });
  } catch (error) {
    console.error('[enrollments GET] Fehler:', error);
    return NextResponse.json(
      { error: 'Einschreibungen konnten nicht geladen werden.' },
      { status: 500 }
    );
  }
}

/** POST /api/enrollments – enroll the current user in a course */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { courseId, courseSlug } = body as { courseId?: string; courseSlug?: string };

    if (!courseId && !courseSlug) {
      return NextResponse.json({ error: 'Kurs-ID oder Kurs-Slug ist erforderlich.' }, { status: 400 });
    }

    // Check if course exists in DB – look up by id or slug
    const course = courseSlug
      ? await prisma.course.findUnique({ where: { slug: courseSlug } })
      : await prisma.course.findUnique({ where: { id: courseId } });

    if (!course) {
      return NextResponse.json({ error: 'Kurs nicht gefunden.' }, { status: 404 });
    }

    // Check if already enrolled
    const existing = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Bereits eingeschrieben.' }, { status: 409 });
    }

    const enrollment = await prisma.$transaction(async (tx) => {
      const created = await tx.courseEnrollment.create({
        data: { userId: session.user.id, courseId: course.id },
      });

      await tx.course.update({
        where: { id: course.id },
        data: { studentsCount: { increment: 1 } },
      });

      return created;
    });

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error('[enrollments POST] Fehler:', error);
    return NextResponse.json(
      { error: 'Einschreibung fehlgeschlagen.' },
      { status: 500 }
    );
  }
}
