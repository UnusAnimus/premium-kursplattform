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

/** GET /api/admin/courses/[id] – get a single course with modules and lessons */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: { orderBy: { order: 'asc' } },
          },
        },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Kurs nicht gefunden.' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (err) {
    console.error('[admin/courses/[id] GET]', err);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}

/** PUT /api/admin/courses/[id] – update a course */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json() as Record<string, unknown>;

    const levelMap: Record<string, 'Anfaenger' | 'Fortgeschritten' | 'Experte'> = {
      'Anfänger': 'Anfaenger',
      Anfaenger: 'Anfaenger',
      Fortgeschritten: 'Fortgeschritten',
      Experte: 'Experte',
    };

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.longDescription !== undefined) updateData.longDescription = body.longDescription;
    if (body.instructor !== undefined) updateData.instructor = body.instructor;
    if (body.instructorBio !== undefined) updateData.instructorBio = body.instructorBio;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.level !== undefined) updateData.level = levelMap[body.level as string] ?? body.level;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice;
    if (body.durationMinutes !== undefined) updateData.durationMinutes = body.durationMinutes;
    if (body.lessonsCount !== undefined) updateData.lessonsCount = body.lessonsCount;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.language !== undefined) updateData.language = body.language;
    if (body.certificate !== undefined) updateData.certificate = body.certificate;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.image !== undefined) updateData.image = body.image;

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ course });
  } catch (err) {
    console.error('[admin/courses/[id] PUT]', err);
    return NextResponse.json({ error: 'Kurs konnte nicht aktualisiert werden.' }, { status: 500 });
  }
}

/** DELETE /api/admin/courses/[id] – delete a course */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/courses/[id] DELETE]', err);
    return NextResponse.json({ error: 'Kurs konnte nicht gelöscht werden.' }, { status: 500 });
  }
}
