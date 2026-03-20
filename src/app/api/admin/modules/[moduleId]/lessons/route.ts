import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 }) };
  }
  const role = (session.user as { role?: string }).role;
  if (role !== 'admin') {
    return { error: NextResponse.json({ error: 'Keine Berechtigung.' }, { status: 403 }) };
  }
  return { session };
}

/** POST /api/admin/modules/[moduleId]/lessons – create a lesson in a module */
export async function POST(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { moduleId } = await params;

  try {
    const body = await req.json() as {
      title?: string;
      description?: string;
      durationMin?: number;
      videoUrl?: string;
      isFree?: boolean;
      order?: number;
    };

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Titel ist erforderlich.' }, { status: 400 });
    }

    // Determine next order if not provided
    let order = body.order;
    if (order === undefined) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { moduleId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (lastLesson?.order ?? 0) + 1;
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() ?? '',
        durationMin: body.durationMin ?? 0,
        videoUrl: body.videoUrl?.trim() || null,
        isFree: body.isFree ?? false,
        order,
        moduleId,
      },
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (err) {
    console.error('[admin/modules/[moduleId]/lessons POST]', err);
    return NextResponse.json({ error: 'Lektion konnte nicht erstellt werden.' }, { status: 500 });
  }
}
