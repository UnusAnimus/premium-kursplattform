import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{ lessonId: string }>;
}

/** POST /api/lessons/[lessonId]/complete – mark a lesson as completed */
export async function POST(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }

  const { lessonId } = await params;

  try {
    // Verify lesson exists and user is enrolled in the course
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                enrollments: { where: { userId: session.user.id } },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lektion nicht gefunden.' }, { status: 404 });
    }

    const isEnrolled = lesson.module.course.enrollments.length > 0;
    if (!lesson.isFree && !isEnrolled) {
      return NextResponse.json({ error: 'Kein Zugriff auf diese Lektion.' }, { status: 403 });
    }

    // Upsert completion (idempotent)
    const completion = await prisma.lessonCompletion.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      create: { userId: session.user.id, lessonId },
      update: {},
    });

    return NextResponse.json({ completion }, { status: 200 });
  } catch (error) {
    console.error('[lesson complete POST] Fehler:', error);
    return NextResponse.json({ error: 'Fehler beim Markieren der Lektion.' }, { status: 500 });
  }
}

/** DELETE /api/lessons/[lessonId]/complete – unmark a lesson as completed */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }

  const { lessonId } = await params;

  try {
    await prisma.lessonCompletion.deleteMany({
      where: { userId: session.user.id, lessonId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[lesson complete DELETE] Fehler:', error);
    return NextResponse.json({ error: 'Fehler beim Zurücksetzen der Lektion.' }, { status: 500 });
  }
}
