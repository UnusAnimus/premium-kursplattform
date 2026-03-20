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

/** PUT /api/admin/modules/[moduleId] – update a module */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { moduleId } = await params;

  try {
    const body = await req.json() as { title?: string; description?: string; order?: number };

    const updateData: { title?: string; description?: string; order?: number } = {};
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.order !== undefined) updateData.order = body.order;

    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: updateData,
      include: { lessons: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ module: updatedModule });
  } catch (err) {
    console.error('[admin/modules/[moduleId] PUT]', err);
    return NextResponse.json({ error: 'Modul konnte nicht aktualisiert werden.' }, { status: 500 });
  }
}

/** DELETE /api/admin/modules/[moduleId] – delete a module and its lessons */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { moduleId } = await params;

  try {
    await prisma.module.delete({ where: { id: moduleId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/modules/[moduleId] DELETE]', err);
    return NextResponse.json({ error: 'Modul konnte nicht gelöscht werden.' }, { status: 500 });
  }
}
