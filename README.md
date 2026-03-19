# Arkanum Akademie – Premium Kursplattform

Eine moderne Next.js-Kursplattform für Metaphysik, Bewusstseinsentwicklung und esoterisches Wissen.

## ✨ Features

- 🔐 **Authentifizierung** – Login/Logout via NextAuth.js (Credentials-Provider)
- 🛡️ **Geschützte Routen** – Mitglieder- und Admin-Bereich werden per Middleware gesichert
- 👑 **Super Admin** – Konfigurierbar über Umgebungsvariablen
- 🌙 **Dark/Light Mode** – Umschaltbar, wird in LocalStorage gespeichert
- 📱 **Responsive Design** – Mobile-first mit Tailwind CSS
- 🎨 **Theme-Editor** – Admin kann Farben und Design anpassen

## 🚀 Installation & Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

Erstelle eine `.env.local` Datei (basierend auf `.env.example`):

```bash
cp .env.example .env.local
```

Öffne `.env.local` und trage deine Werte ein:

```env
# Pflichtfelder
NEXTAUTH_SECRET=<zufälliger 32-Byte-Hex-String>
NEXTAUTH_URL=http://localhost:3000

# Super Admin – trage deine E-Mail ein
SUPER_ADMIN_EMAIL=deine@email.de
SUPER_ADMIN_NAME=Dein Name
SUPER_ADMIN_PLAIN_PASSWORD=DeinSicheresPasswort123!
```

**NEXTAUTH_SECRET generieren:**
```bash
node -e "require('crypto').randomBytes(32).then?.(console.log) || console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

### 4. Als Super Admin anmelden

Gehe zu `/login` und melde dich mit der E-Mail und dem Passwort an, die du in `.env.local` eingetragen hast.

---

## 🔑 Super Admin einrichten

Der Super Admin wird vollständig über Umgebungsvariablen konfiguriert:

| Variable | Beschreibung |
|---|---|
| `SUPER_ADMIN_EMAIL` | E-Mail-Adresse des Super Admins |
| `SUPER_ADMIN_NAME` | Anzeigename des Super Admins |
| `SUPER_ADMIN_PLAIN_PASSWORD` | Klartextpasswort (nur Entwicklung!) |
| `SUPER_ADMIN_PASSWORD_HASH` | bcrypt-Hash (für Produktion empfohlen) |

**bcrypt-Hash generieren (für Produktion):**
```bash
node -e "require('bcryptjs').hash('DeinPasswort', 12).then(console.log)"
```

---

## 📁 Projektstruktur

```
src/
├── app/
│   ├── (public)/          # Öffentliche Seiten (Navbar + Footer)
│   ├── (mitglieder)/      # Mitgliederbereich (geschützt)
│   ├── (admin)/           # Adminbereich (geschützt, nur admin role)
│   ├── api/auth/          # NextAuth API-Route
│   └── login/             # Login/Registrierungs-Seite
├── components/
│   ├── layout/            # Navbar, Footer, Sidebars
│   ├── sections/          # Hero, Features, CourseCard, ...
│   └── ui/                # Button, Input, Card, ...
├── hooks/                 # useTheme
├── lib/                   # auth.ts, data.ts, types.ts, utils.ts
├── middleware.ts           # Route-Schutz
└── types/                 # NextAuth TypeScript-Erweiterungen
```

---

## 🧪 Automatisierte Tests (E2E mit Playwright)

Die Test-Suite deckt die kritischen User-Flows ab: **Gast**, **Member** und **Admin**.

### Testübersicht

| Datei | Scope |
|---|---|
| `tests/e2e/guest.spec.ts` | A – Gast-Navigation, öffentliche Seiten, Redirect-Schutz |
| `tests/e2e/member.spec.ts` | B – Member-Login, Dashboard, Logout, Rollen-Navbar |
| `tests/e2e/admin.spec.ts` | C – Admin-Login, Admin-Bereich, Admin-Navigation |
| `tests/e2e/redirects.spec.ts` | D – Middleware-Schutz, Login-Redirects, Host-Validierung |

### Lokal testen

**Voraussetzungen:**
- PostgreSQL-Datenbank läuft lokal (oder `.env.test.local` angepasst)
- Chromium-Browser für Playwright installiert

```bash
# 1. Playwright-Browser installieren (einmalig)
npx playwright install chromium --with-deps

# 2. Test-Umgebungsvariablen konfigurieren
cp .env.test.example .env.test.local
# → .env.test.local anpassen (DB, Admin-Passwort etc.)

# 3. Datenbank vorbereiten und Testdaten einspielen
npx prisma migrate deploy
npm run db:seed

# 4. Produktions-Build erstellen und starten
npm run build
npm start &

# 5. E2E-Tests ausführen
npm run test:e2e

# Optional: Interaktive UI
npm run test:e2e:ui

# Optional: HTML-Report anzeigen
npm run test:e2e:report
```

### In GitHub Actions (CI)

Bei jedem **Push** und **Pull Request** läuft automatisch:
1. **Lint & Build** – ESLint + `next build`
2. **E2E Tests** – Playwright gegen einen PostgreSQL-Service-Container

Der Workflow ist in `.github/workflows/ci.yml` konfiguriert.

---

## 🏗️ Was noch fehlt (Roadmap)

Die Plattform ist ein UI-Prototyp. Folgende Features fehlen noch für den Produktionsbetrieb:

- **Datenbank** – PostgreSQL/MySQL mit Prisma ORM
- **Echte Nutzerverwaltung** – Registrierung, Einladungen, Passwort-Reset
- **Zahlungen** – Stripe-Integration
- **E-Mail** – Kontaktformular, Willkommens-E-Mails, Passwort-Reset
- **Video-Hosting** – Kursinhalte hochladen und streamen
- **KI-Assistent** – Echte OpenAI/Anthropic-Integration
- **Google OAuth** – Social Login
- **Analytics** – Nutzungsstatistiken

Alle offen Issues sind auf GitHub als Issues dokumentiert.

---

## 🛠️ Technologie-Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) |
| Sprache | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v4 |
| Passwort-Hashing | bcryptjs |
| Fonts | Geist (self-hosted) |

## Deployment auf Vercel

Auf [Vercel](https://vercel.com) die Umgebungsvariablen aus `.env.example` eintragen und deployen.
