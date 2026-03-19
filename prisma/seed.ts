/**
 * Prisma seed script – populates the database with the same sample data
 * that is currently served from src/lib/data.ts.
 *
 * Run:  npx prisma db seed
 *   or  npm run db:seed
 *
 * Prerequisites: DATABASE_URL must be set and migrations applied.
 */

import { PrismaClient, Level, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database …');

  // ------------------------------------------------------------------
  // Super Admin
  // ------------------------------------------------------------------
  const adminEmail = process.env.SUPER_ADMIN_EMAIL ?? 'admin@arkanum-akademie.de';
  const adminName = process.env.SUPER_ADMIN_NAME ?? 'Super Administrator';
  const plainPassword = process.env.SUPER_ADMIN_PLAIN_PASSWORD ?? 'Admin123!';
  const passwordHash =
    process.env.SUPER_ADMIN_PASSWORD_HASH ?? (await bcrypt.hash(plainPassword, 12));

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: Role.admin,
    },
  });
  console.log('  ✔ Super admin created / already exists');

  // ------------------------------------------------------------------
  // Sample member user
  // ------------------------------------------------------------------
  const memberHash = await bcrypt.hash('Member123!', 12);
  await prisma.user.upsert({
    where: { email: 'mitglied@arkanum-akademie.de' },
    update: {},
    create: {
      email: 'mitglied@arkanum-akademie.de',
      name: 'Max Mustermann',
      passwordHash: memberHash,
      role: Role.member,
      bio: 'Begeisterter Schüler der Metaphysik und Esoterik.',
      subscription: {
        create: {
          plan: 'premium',
          status: 'active',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2025-01-01'),
          price: 49,
          autoRenew: true,
        },
      },
    },
  });
  console.log('  ✔ Sample member created / already exists');

  // ------------------------------------------------------------------
  // Courses (from data.ts)
  // ------------------------------------------------------------------
  const courseSeed = [
    {
      slug: 'metaphysik-bewusstsein',
      title: 'Metaphysik & Bewusstsein',
      description:
        'Eine tiefe Reise in die Natur des Bewusstseins und die metaphysischen Grundlagen der Existenz.',
      longDescription:
        'Tauche ein in die tiefsten Fragen der menschlichen Existenz. Dieser umfassende Kurs führt dich durch die Grundlagen der Metaphysik, von den antiken griechischen Denkern bis zu modernen Bewusstseinstheorien.',
      instructor: 'Dr. Elena Mystika',
      instructorBio:
        'Dr. Elena Mystika hat über 20 Jahre Erfahrung in Metaphysik und Bewusstseinsforschung.',
      durationMinutes: 1440,
      lessonsCount: 48,
      price: 297,
      originalPrice: 497,
      rating: 4.9,
      reviewsCount: 342,
      image: '/courses/metaphysik.jpg',
      category: 'Metaphysik',
      level: Level.Anfaenger,
      tags: ['Bewusstsein', 'Philosophie', 'Meditation', 'Quantenphysik'],
      studentsCount: 1247,
      language: 'Deutsch',
      certificate: true,
      featured: true,
      modules: [
        {
          title: 'Grundlagen der Metaphysik',
          description: 'Einführung in die grundlegenden Konzepte',
          order: 1,
          lessons: [
            { title: 'Was ist Metaphysik?', description: 'Einführung und Überblick', durationMin: 25, isFree: true, order: 1 },
            { title: 'Die Natur der Wirklichkeit', description: 'Verschiedene Wirklichkeitsmodelle', durationMin: 38, isFree: true, order: 2 },
            { title: 'Bewusstsein als Grundprinzip', description: 'Panpsychismus und Bewusstseinstheorien', durationMin: 42, isFree: false, order: 3 },
            { title: 'Zeit, Raum und Kausalität', description: 'Metaphysische Dimensionen', durationMin: 35, isFree: false, order: 4 },
          ],
        },
        {
          title: 'Bewusstseinserweiterung',
          description: 'Praktische Techniken zur Bewusstseinserweiterung',
          order: 2,
          lessons: [
            { title: 'Meditative Zustände', description: 'Alpha, Theta und Delta Gehirnwellen', durationMin: 45, isFree: false, order: 1 },
            { title: 'Außerkörperliche Erfahrungen', description: 'Theorie und Praxis', durationMin: 52, isFree: false, order: 2 },
            { title: 'Quantenbewusstsein', description: 'Moderne Theorien des Geistes', durationMin: 48, isFree: false, order: 3 },
          ],
        },
        {
          title: 'Praktische Anwendung',
          description: 'Metaphysik im Alltag anwenden',
          order: 3,
          lessons: [
            { title: 'Manifestation und Intention', description: 'Die Kraft des Denkens nutzen', durationMin: 40, isFree: false, order: 1 },
            { title: 'Synchronizität erkennen', description: 'Meaningful coincidences', durationMin: 35, isFree: false, order: 2 },
            { title: 'Integration ins tägliche Leben', description: 'Abschluss und Zusammenfassung', durationMin: 30, isFree: false, order: 3 },
          ],
        },
      ],
    },
    {
      slug: 'quantenheilung',
      title: 'Quantenheilung',
      description:
        'Entdecke die heilenden Kräfte der Quantenphysik und energetischen Heilmethoden.',
      longDescription:
        'Quantenheilung verbindet modernste Erkenntnisse der Quantenphysik mit jahrtausendealten Heiltraditionen.',
      instructor: 'Prof. Karl Richter',
      instructorBio:
        'Prof. Karl Richter ist Physiker und Heiler mit 15 Jahren Forschungserfahrung.',
      durationMinutes: 2400,
      lessonsCount: 42,
      price: 347,
      originalPrice: 597,
      rating: 4.8,
      reviewsCount: 217,
      image: '/courses/quantenheilung.jpg',
      category: 'Heilung',
      level: Level.Fortgeschritten,
      tags: ['Quantenphysik', 'Heilung', 'Energie', 'Bioresonanz'],
      studentsCount: 892,
      language: 'Deutsch',
      certificate: true,
      featured: true,
      modules: [
        {
          title: 'Quantenphysik Grundlagen',
          description: 'Die Wissenschaft hinter der Quantenheilung',
          order: 1,
          lessons: [
            { title: 'Einführung in die Quantenphysik', description: 'Grundlegende Konzepte', durationMin: 35, isFree: true, order: 1 },
            { title: 'Das Doppelspaltexperiment', description: 'Welle-Teilchen-Dualismus', durationMin: 42, isFree: false, order: 2 },
          ],
        },
        {
          title: 'Energetische Heilmethoden',
          description: 'Praktische Heilanwendungen',
          order: 2,
          lessons: [
            { title: 'PEMF-Therapie', description: 'Gepulste elektromagnetische Felder', durationMin: 55, isFree: false, order: 1 },
            { title: 'Bioresonanz', description: 'Frequenzheilung verstehen', durationMin: 48, isFree: false, order: 2 },
          ],
        },
      ],
    },
    {
      slug: 'astrologie-meisterkurs',
      title: 'Astrologie Meisterkurs',
      description:
        'Lerne die Sprache der Sterne und erstelle professionelle Geburtshoroskope.',
      longDescription:
        'Von den Grundlagen der Astrologie bis hin zu fortgeschrittenen Techniken wie Progressionen und Synastrie.',
      instructor: 'Astrologin Luna Steiner',
      instructorBio:
        'Luna Steiner ist zertifizierte Astrologin mit 12 Jahren Berufserfahrung.',
      durationMinutes: 1800,
      lessonsCount: 36,
      price: 247,
      rating: 4.7,
      reviewsCount: 183,
      image: '/courses/astrologie.jpg',
      category: 'Astrologie',
      level: Level.Anfaenger,
      tags: ['Astrologie', 'Horoskop', 'Planeten', 'Zodiak'],
      studentsCount: 654,
      language: 'Deutsch',
      certificate: true,
      featured: false,
      modules: [
        {
          title: 'Grundlagen der Astrologie',
          description: 'Die Sprache der Sterne lernen',
          order: 1,
          lessons: [
            { title: 'Die 12 Tierkreiszeichen', description: 'Eigenschaften und Bedeutungen', durationMin: 40, isFree: true, order: 1 },
            { title: 'Die Planeten und ihre Bedeutung', description: 'Sonne, Mond und Co.', durationMin: 45, isFree: false, order: 2 },
          ],
        },
      ],
    },
  ];

  for (const courseData of courseSeed) {
    const { modules, ...courseFields } = courseData;
    const existing = await prisma.course.findUnique({ where: { slug: courseFields.slug } });
    if (existing) {
      console.log(`  ⏭  Course "${courseFields.title}" already exists – skipping`);
      continue;
    }

    await prisma.course.create({
      data: {
        ...courseFields,
        modules: {
          create: modules.map(({ lessons, ...mod }) => ({
            ...mod,
            lessons: {
              create: lessons,
            },
          })),
        },
      },
    });
    console.log(`  ✔ Course "${courseFields.title}" created`);
  }

  console.log('🌱 Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
