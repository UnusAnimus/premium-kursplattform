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
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return NextResponse.json({ enrollments });
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
    const { courseId } = body as { courseId?: string };

    if (!courseId) {
      return NextResponse.json({ error: 'Kurs-ID ist erforderlich.' }, { status: 400 });
    }

    // Check if course exists in DB
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Kurs nicht gefunden.' }, { status: 404 });
    }

    // Check if already enrolled
    const existing = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Bereits eingeschrieben.' }, { status: 409 });
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: { userId: session.user.id, courseId },
    });

    // Update studentsCount
    await prisma.course.update({
      where: { id: courseId },
      data: { studentsCount: { increment: 1 } },
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
