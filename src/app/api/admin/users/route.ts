import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        subscription: {
          select: { plan: true, status: true },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('[admin/users GET] Fehler:', error);
    return NextResponse.json(
      { error: 'Nutzerdaten konnten nicht geladen werden.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, role } = body as { id?: string; role?: string };

    if (!id || !role) {
      return NextResponse.json({ error: 'ID und Rolle sind erforderlich.' }, { status: 400 });
    }

    const validRoles = ['admin', 'instructor', 'member'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Ungültige Rolle.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: role as 'admin' | 'instructor' | 'member' },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('[admin/users PUT] Fehler:', error);
    return NextResponse.json(
      { error: 'Nutzer konnte nicht aktualisiert werden.' },
      { status: 500 }
    );
  }
}
