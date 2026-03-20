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

/** POST /api/admin/courses/[id]/modules – create a new module */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id: courseId } = await params;

  try {
    const body = await req.json() as { title?: string; description?: string; order?: number };

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Titel ist erforderlich.' }, { status: 400 });
    }

    // Determine the next order number if not provided
    let order = body.order;
    if (order === undefined) {
      const lastModule = await prisma.module.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (lastModule?.order ?? 0) + 1;
    }

    const newModule = await prisma.module.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() ?? '',
        order,
        courseId,
      },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ module: newModule }, { status: 201 });
  } catch (err) {
    console.error('[admin/courses/[id]/modules POST]', err);
    return NextResponse.json({ error: 'Modul konnte nicht erstellt werden.' }, { status: 500 });
  }
}
