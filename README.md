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
