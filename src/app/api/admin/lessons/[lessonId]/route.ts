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

/** PUT /api/admin/lessons/[lessonId] – update a lesson */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { lessonId } = await params;

  try {
    const body = await req.json() as {
      title?: string;
      description?: string;
      durationMin?: number;
      videoUrl?: string | null;
      isFree?: boolean;
      order?: number;
    };

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.durationMin !== undefined) updateData.durationMin = body.durationMin;
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl?.trim() || null;
    if (body.isFree !== undefined) updateData.isFree = body.isFree;
    if (body.order !== undefined) updateData.order = body.order;

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
    });

    return NextResponse.json({ lesson });
  } catch (err) {
    console.error('[admin/lessons/[lessonId] PUT]', err);
    return NextResponse.json({ error: 'Lektion konnte nicht aktualisiert werden.' }, { status: 500 });
  }
}

/** DELETE /api/admin/lessons/[lessonId] – delete a lesson */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { lessonId } = await params;

  try {
    await prisma.lesson.delete({ where: { id: lessonId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/lessons/[lessonId] DELETE]', err);
    return NextResponse.json({ error: 'Lektion konnte nicht gelöscht werden.' }, { status: 500 });
  }
}
