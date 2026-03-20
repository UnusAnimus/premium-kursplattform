import { NextResponse } from 'next/server';
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

/** GET /api/admin/lessons – list all lessons with their module and course info */
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: [{ module: { course: { title: 'asc' } } }, { module: { order: 'asc' } }, { order: 'asc' }],
      include: {
        module: {
          select: {
            id: true,
            title: true,
            courseId: true,
            course: { select: { id: true, title: true, slug: true } },
          },
        },
      },
    });

    return NextResponse.json({ lessons });
  } catch (err) {
    console.error('[admin/lessons GET]', err);
    return NextResponse.json({ error: 'Fehler beim Laden der Lektionen.' }, { status: 500 });
  }
}
