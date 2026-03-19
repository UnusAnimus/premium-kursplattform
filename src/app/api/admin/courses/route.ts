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

/** GET /api/admin/courses – list all courses with module/lesson counts */
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: { lessons: true },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ courses });
  } catch (err) {
    console.error('[admin/courses GET]', err);
    return NextResponse.json({ error: 'Fehler beim Laden der Kurse.' }, { status: 500 });
  }
}

/** POST /api/admin/courses – create a new course */
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json() as {
      title?: string;
      slug?: string;
      description?: string;
      longDescription?: string;
      instructor?: string;
      instructorBio?: string;
      category?: string;
      level?: string;
      price?: number;
      originalPrice?: number;
      durationMinutes?: number;
      lessonsCount?: number;
      tags?: string[];
      language?: string;
      certificate?: boolean;
      featured?: boolean;
      image?: string;
    };

    const { title, slug, description, longDescription, instructor, instructorBio, category, level, price } = body;

    if (!title || !slug || !description || !instructor || !category || !level || price === undefined) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 });
    }

    const levelMap: Record<string, 'Anfaenger' | 'Fortgeschritten' | 'Experte'> = {
      'Anfänger': 'Anfaenger',
      Anfaenger: 'Anfaenger',
      Fortgeschritten: 'Fortgeschritten',
      Experte: 'Experte',
    };
    const prismaLevel = levelMap[level] ?? 'Anfaenger';

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        longDescription: longDescription ?? description,
        instructor,
        instructorBio: instructorBio ?? '',
        category,
        level: prismaLevel,
        price,
        originalPrice: body.originalPrice ?? null,
        durationMinutes: body.durationMinutes ?? 0,
        lessonsCount: body.lessonsCount ?? 0,
        tags: body.tags ?? [],
        language: body.language ?? 'Deutsch',
        certificate: body.certificate ?? false,
        featured: body.featured ?? false,
        image: body.image ?? null,
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (err) {
    console.error('[admin/courses POST]', err);
    return NextResponse.json({ error: 'Kurs konnte nicht erstellt werden.' }, { status: 500 });
  }
}
