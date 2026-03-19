#!/usr/bin/env node
/**
 * Skript zum automatischen Erstellen der GitHub Issues.
 * Verwendung: GITHUB_TOKEN=... node scripts/create-issues.js
 *
 * Benötigt: Node.js 18+ (fetch ist eingebaut)
 * GitHub Personal Access Token mit 'issues' Write-Berechtigung.
 */

const OWNER = 'UnusAnimus';
const REPO = 'premium-kursplattform';

const issues = [
  // CRITICAL
  {
    title: '[BACKEND] Datenbank einrichten (PostgreSQL + Prisma ORM)',
    body: `## Problem\nDie Plattform nutzt aktuell nur Mock-Daten. Es gibt keine echte Datenbank.\n\n## Aufgaben\n- [ ] PostgreSQL-Datenbank einrichten\n- [ ] Prisma ORM integrieren\n- [ ] Schema: User, Course, Module, Lesson, Subscription, Payment\n- [ ] Seed-Script für Testdaten\n- [ ] Mock-Daten durch echte DB-Abfragen ersetzen`,
    labels: ['backend', 'database'],
  },
  {
    title: '[AUTH] Nutzer-Registrierung implementieren',
    body: `## Problem\nDas Registrierungsformular sendet keine Daten. Neue Nutzer können sich nicht registrieren.\n\n## Aufgaben\n- [ ] API-Route \`POST /api/auth/register\`\n- [ ] Nutzer in Datenbank speichern (bcrypt-Hash)\n- [ ] E-Mail-Duplikat-Check\n- [ ] Registrierungsformular mit Backend verbinden`,
    labels: ['auth', 'backend'],
  },
  {
    title: '[AUTH] Passwort vergessen / Reset implementieren',
    body: `## Problem\nDer "Passwort vergessen"-Link ist nicht funktional.\n\n## Aufgaben\n- [ ] API \`POST /api/auth/forgot-password\`\n- [ ] API \`POST /api/auth/reset-password\`\n- [ ] UI-Seite \`/passwort-reset\`\n- [ ] E-Mail-Template für Reset-Link`,
    labels: ['auth', 'backend'],
  },
  {
    title: '[FEATURE] Kurs-Einschreibung und Zugriffskontrolle',
    body: `## Problem\nKurs-Einschreibung und Kauf sind nicht implementiert.\n\n## Aufgaben\n- [ ] Einschreibungs-Logik\n- [ ] Kurszugriff auf eingeschriebene Nutzer beschränken\n- [ ] Kauf-Flow implementieren`,
    labels: ['feature', 'backend'],
  },
  // HIGH
  {
    title: '[PAYMENTS] Stripe-Integration für Abonnements',
    body: `## Problem\nKeine Zahlungsmöglichkeit vorhanden.\n\n## Aufgaben\n- [ ] Stripe-API konfigurieren\n- [ ] Checkout-Session erstellen\n- [ ] Webhook-Handler für Stripe-Events\n- [ ] Abo-Status in DB aktualisieren`,
    labels: ['payments', 'backend'],
  },
  {
    title: '[BACKEND] E-Mail-Versand einrichten',
    body: `## Problem\nKontaktformular und Passwort-Reset senden keine E-Mails.\n\n## Aufgaben\n- [ ] E-Mail-Provider (Resend/Nodemailer)\n- [ ] Kontaktformular-API\n- [ ] E-Mail-Templates`,
    labels: ['backend', 'email'],
  },
  {
    title: '[FEATURE] Video-Hosting für Kurslektionen',
    body: `## Problem\nKurslektionen haben kein Video-Hosting.\n\n## Aufgaben\n- [ ] Video-Hosting-Lösung (Mux/Cloudflare Stream)\n- [ ] Upload-API für Admin\n- [ ] Video-Player-Komponente\n- [ ] Fortschritt tracken`,
    labels: ['feature', 'backend'],
  },
  {
    title: '[FEATURE] KI-Assistent mit echter AI-API verbinden',
    body: `## Problem\nDer KI-Assistent sendet Fake-Antworten.\n\n## Aufgaben\n- [ ] OpenAI/Anthropic API einbinden\n- [ ] API-Route \`POST /api/ki/chat\`\n- [ ] Rate-Limiting`,
    labels: ['feature', 'ai'],
  },
  {
    title: '[AUTH] Google OAuth Login implementieren',
    body: `## Problem\n"Mit Google fortfahren"-Button ist deaktiviert.\n\n## Aufgaben\n- [ ] Google OAuth App erstellen\n- [ ] Google Provider in NextAuth aktivieren`,
    labels: ['auth', 'oauth'],
  },
  // MEDIUM
  {
    title: '[ADMIN] Nutzer-Management-Funktionen implementieren',
    body: `## Problem\nAdmin-Nutzer-Verwaltung ist nicht funktional.\n\n## Aufgaben\n- [ ] Nutzer-Liste aus DB laden\n- [ ] Nutzer bearbeiten/löschen\n- [ ] Einladungs-E-Mail`,
    labels: ['admin', 'feature'],
  },
  {
    title: '[ADMIN] Kurs- und Lektions-Verwaltung (CRUD)',
    body: `## Problem\nAdmin-Seiten haben keine CRUD-Funktionen.\n\n## Aufgaben\n- [ ] Kurs erstellen/bearbeiten/löschen\n- [ ] Lektionen verwalten\n- [ ] Bild-Upload`,
    labels: ['admin', 'feature'],
  },
  {
    title: '[FEATURE] Echtes Lernfortschritt-Tracking',
    body: `## Problem\nFortschrittsseite zeigt nur Mock-Daten.\n\n## Aufgaben\n- [ ] Lektion-Abschluss API\n- [ ] Fortschritt in DB speichern\n- [ ] Zertifikat bei 100%`,
    labels: ['feature', 'backend'],
  },
  {
    title: '[FEATURE] Profil-Bearbeitung mit Backend',
    body: `## Problem\nProfilseite speichert keine Änderungen.\n\n## Aufgaben\n- [ ] API \`PUT /api/user/profile\`\n- [ ] Avatar-Upload\n- [ ] Passwort ändern`,
    labels: ['feature', 'backend'],
  },
  {
    title: '[UX] Kurssuche mit Volltextsuche implementieren',
    body: `## Problem\nKeine Texteingabe-Suche vorhanden.\n\n## Aufgaben\n- [ ] Suchfeld hinzufügen\n- [ ] Server-seitige Suche\n- [ ] URL-Parameter`,
    labels: ['ux', 'feature'],
  },
  // LOW
  {
    title: '[UX] Loading States und Skeleton Screens',
    body: `## Problem\nKeine visuellen Laderückmeldungen.\n\n## Aufgaben\n- [ ] Skeleton-Loader-Komponente\n- [ ] loading.tsx für App Router`,
    labels: ['ux', 'design'],
  },
  {
    title: '[UX] Error Boundaries und 404/500-Seiten',
    body: `## Problem\nBei Fehlern keine nutzerfreundlichen Meldungen.\n\n## Aufgaben\n- [ ] error.tsx\n- [ ] not-found.tsx\n- [ ] Toast-Notifications`,
    labels: ['ux', 'design'],
  },
  {
    title: '[AUTH] E-Mail-Verifizierung bei Registrierung',
    body: `## Problem\nNeue Nutzer müssen ihre E-Mail nicht bestätigen.\n\n## Aufgaben\n- [ ] Verifikations-Token\n- [ ] E-Mail senden\n- [ ] Account erst nach Verifikation aktivieren`,
    labels: ['auth', 'backend'],
  },
  {
    title: '[SECURITY] Rate-Limiting, Security Headers, Next.js Update',
    body: `## Problem\nKeine expliziten Sicherheitsmassnahmen.\n\n## Aufgaben\n- [ ] Rate-Limiting für APIs\n- [ ] Security Headers\n- [ ] Input-Validierung (zod)\n- [ ] Next.js >= 16.2.0 (Disk-Cache-Vulnerability GHSA-3x4c-7xq6-9pq8)`,
    labels: ['security', 'backend'],
  },
  {
    title: '[FEATURE] Analytics und Performance-Monitoring',
    body: `## Problem\nKeine Nutzerstatistiken.\n\n## Aufgaben\n- [ ] Vercel Analytics oder Plausible\n- [ ] Sentry für Fehler-Tracking\n- [ ] Admin-Dashboard mit echten Statistiken`,
    labels: ['feature', 'analytics'],
  },
  {
    title: '[UX] Mobile Sidebar für Mitglieder- und Admin-Bereich',
    body: `## Problem\nSidebars sind auf Mobile nicht zugänglich.\n\n## Aufgaben\n- [ ] Hamburger-Menü für Member-Sidebar\n- [ ] Hamburger-Menü für Admin-Sidebar\n- [ ] Touch-Gesten`,
    labels: ['ux', 'mobile', 'design'],
  },
];

async function createIssues() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ GITHUB_TOKEN Umgebungsvariable ist nicht gesetzt.');
    console.error('   Verwendung: GITHUB_TOKEN=ghp_... node scripts/create-issues.js');
    process.exit(1);
  }

  console.log(`🚀 Erstelle ${issues.length} GitHub Issues für ${OWNER}/${REPO}...`);
  console.log('');

  let created = 0;
  let failed = 0;

  for (const issue of issues) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/issues`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(issue),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ #${data.number}: ${issue.title}`);
        created++;
      } else {
        const err = await response.json();
        console.error(`❌ Fehler bei "${issue.title}": ${err.message}`);
        failed++;
      }

      // Rate limit: 1 Issue pro Sekunde
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`❌ Netzwerkfehler bei "${issue.title}":`, err.message);
      failed++;
    }
  }

  console.log('');
  console.log(`✅ ${created} Issues erstellt, ❌ ${failed} fehlgeschlagen.`);
}

createIssues().catch(console.error);
