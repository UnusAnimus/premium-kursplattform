import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, bio: true, avatar: true, createdAt: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Nutzer nicht gefunden.' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('[profile GET] Fehler:', error);
    return NextResponse.json(
      { error: 'Profildaten konnten nicht geladen werden.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, bio } = body as { name?: string; bio?: string };

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Name darf nicht leer sein.' },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        bio: bio?.trim() ?? null,
      },
      select: { id: true, name: true, email: true, bio: true, avatar: true, createdAt: true, role: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('[profile PUT] Fehler:', error);
    return NextResponse.json(
      { error: 'Profil konnte nicht gespeichert werden.' },
      { status: 500 }
    );
  }
}
