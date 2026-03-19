import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { role } = body as { role?: string };

    const validRoles = ['admin', 'instructor', 'member'];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ error: 'Ungültige Rolle.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: role as 'admin' | 'instructor' | 'member' },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('[admin/users/[id] PUT] Fehler:', error);
    return NextResponse.json(
      { error: 'Nutzer konnte nicht aktualisiert werden.' },
      { status: 500 }
    );
  }
}
