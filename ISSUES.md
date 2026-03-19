# GitHub Issues – Arkanum Akademie Plattform

Diese Datei listet alle geplanten GitHub Issues auf. Die Issues wurden analysiert und können direkt auf GitHub erstellt werden.

---

## 🔴 Kritisch (CRITICAL)

### Issue 1: Datenbank-Integration (Database)
**Titel:** `[BACKEND] Datenbank einrichten (PostgreSQL + Prisma ORM)`

**Beschreibung:**
Die gesamte Plattform nutzt aktuell nur Mock-Daten aus `src/lib/data.ts`. Es gibt keine echte Datenbank. 

**Aufgaben:**
- PostgreSQL-Datenbank einrichten (lokal + Produktion)
- Prisma ORM integrieren (`npm install prisma @prisma/client`)
- Schema für alle Entitäten erstellen: `User`, `Course`, `Module`, `Lesson`, `Subscription`, `Payment`
- Seed-Script für Testdaten schreiben
- Mock-Daten in `data.ts` durch echte DB-Abfragen ersetzen

**Labels:** `backend`, `database`, `critical`

---

### Issue 2: Nutzer-Registrierung
**Titel:** `[AUTH] Nutzer-Registrierung implementieren`

**Beschreibung:**
Das Registrierungsformular existiert UI-seitig, sendet aber keine Daten. Neue Nutzer können sich nicht selbst registrieren.

**Aufgaben:**
- API-Route `POST /api/auth/register` erstellen
- Nutzer in Datenbank speichern (mit bcrypt-Passwort-Hash)
- E-Mail-Validierung (Duplikat-Check)
- Bestätigungs-E-Mail senden (optional)
- Registrierungsformular mit Backend verbinden

**Labels:** `auth`, `backend`, `critical`

---

### Issue 3: Passwort-Reset Flow
**Titel:** `[AUTH] Passwort vergessen / Reset implementieren`

**Beschreibung:**
Der „Passwort vergessen"-Link im Login ist nicht funktional. Nutzer haben keine Möglichkeit, ihr Passwort zurückzusetzen.

**Aufgaben:**
- API-Route `POST /api/auth/forgot-password` (Token generieren + E-Mail senden)
- API-Route `POST /api/auth/reset-password` (Token validieren + Passwort ändern)
- UI-Seite `/passwort-reset` erstellen
- E-Mail-Template für Reset-Link

**Labels:** `auth`, `backend`, `critical`

---

### Issue 4: Kurse kaufen / Einschreiben
**Titel:** `[FEATURE] Kurs-Einschreibung und Zugriffskontrolle`

**Beschreibung:**
Nutzer können aktuell alle Kursinhalte sehen, obwohl sie nicht eingeschrieben sind. Kauf-Buttons sind nicht funktional.

**Aufgaben:**
- Einschreibungs-Logik implementieren (kostenlos vs. bezahlt)
- Kurszugriff auf eingeschriebene Nutzer beschränken
- „Jetzt kaufen"-Button mit Zahlungs-Flow verbinden
- `enrolledCourses` in Datenbank speichern und abrufen

**Labels:** `feature`, `backend`, `critical`

---

## 🟠 Hoch (HIGH)

### Issue 5: Stripe-Zahlungs-Integration
**Titel:** `[PAYMENTS] Stripe-Integration für Abonnements und Kurskäufe`

**Beschreibung:**
Keine Zahlungsmöglichkeit vorhanden. Alle Preise und Pläne sind nur zur Darstellung.

**Aufgaben:**
- Stripe-Konto verknüpfen + API-Keys konfigurieren
- Checkout-Session erstellen (`POST /api/payments/checkout`)
- Webhook-Handler für Stripe-Events (`POST /api/payments/webhook`)
- Abonnement-Status in DB aktualisieren
- Rechnung-Download implementieren
- Zahlungshistorie in `/abo` anzeigen

**Labels:** `payments`, `stripe`, `backend`, `high`

---

### Issue 6: E-Mail-System
**Titel:** `[BACKEND] E-Mail-Versand einrichten (Nodemailer/Resend)`

**Beschreibung:**
Das Kontaktformular schickt keine E-Mails. Passwort-Reset und Willkommens-E-Mails fehlen.

**Aufgaben:**
- E-Mail-Provider konfigurieren (Resend, Nodemailer mit SMTP)
- API-Route `POST /api/kontakt` für Kontaktformular
- E-Mail-Templates erstellen (Willkommen, Passwort-Reset, Kaufbestätigung)
- Rate-Limiting für Kontaktformular

**Labels:** `backend`, `email`, `high`

---

### Issue 7: Video-Hosting für Kursinhalte
**Titel:** `[FEATURE] Video-Upload und -Streaming für Kurslektionen`

**Beschreibung:**
Kurslektionen haben `videoUrl` im Datenmodell, aber kein Video-Hosting. Lektionen können nicht aufgerufen werden.

**Aufgaben:**
- Video-Hosting-Lösung auswählen (Mux, Cloudflare Stream, Vimeo)
- Upload-API für Admin (`POST /api/admin/upload`)
- Video-Player-Komponente implementieren
- Fortschritt beim Anschauen tracken (Lektionen als abgeschlossen markieren)
- Lektion-Zugriffsschutz (nur eingeschriebene Nutzer)

**Labels:** `feature`, `backend`, `video`, `high`

---

### Issue 8: KI-Assistent (echte Integration)
**Titel:** `[FEATURE] KI-Assistent mit echter AI-API verbinden`

**Beschreibung:**
Der KI-Assistent sendet aktuell zufällige Fake-Antworten. Es gibt keine echte AI-Integration.

**Aufgaben:**
- OpenAI oder Anthropic API einbinden
- API-Route `POST /api/ki/chat` erstellen
- System-Prompt für Arkanum Akademie-Kontext konfigurieren
- Chat-Verlauf in Session oder DB speichern
- Rate-Limiting pro Nutzer implementieren
- KI-Einstellungen im Admin-Bereich funktional machen

**Labels:** `feature`, `ai`, `high`

---

### Issue 9: Google OAuth (Social Login)
**Titel:** `[AUTH] Google OAuth Login implementieren`

**Beschreibung:**
„Mit Google fortfahren"-Button ist deaktiviert (disabled). Viele Nutzer bevorzugen Social Login.

**Aufgaben:**
- Google OAuth App in Google Console erstellen
- `GOOGLE_CLIENT_ID` und `GOOGLE_CLIENT_SECRET` konfigurieren
- Google Provider in NextAuth aktivieren
- Account-Verknüpfung mit E-Mail-Accounts sicherstellen

**Labels:** `auth`, `oauth`, `medium`

---

## 🟡 Mittel (MEDIUM)

### Issue 10: Admin-Nutzer-Management
**Titel:** `[ADMIN] Nutzer-Management-Funktionen implementieren`

**Beschreibung:**
Im Admin-Bereich unter `/admin/nutzer` sind alle Buttons (`Bearbeiten`, `Löschen`, `Einladen`) nicht funktional.

**Aufgaben:**
- Nutzer-Liste aus Datenbank laden
- Nutzer bearbeiten (Rolle, Abo-Status ändern)
- Nutzer deaktivieren/löschen
- Einladungs-E-Mail senden
- Suchfunktion und Filterung

**Labels:** `admin`, `feature`, `medium`

---

### Issue 11: Admin-Kurs-Management
**Titel:** `[ADMIN] Kurs- und Lektions-Verwaltung implementieren`

**Beschreibung:**
Admin-Seiten `/admin/kurse` und `/admin/lektionen` zeigen nur statische Tabellen. CRUD-Operationen fehlen.

**Aufgaben:**
- Kurs erstellen/bearbeiten/löschen (API + UI)
- Lektionen erstellen/bearbeiten/löschen
- Drag & Drop für Lektions-Reihenfolge
- Bild-Upload für Kurs-Thumbnails
- Kurs veröffentlichen/verbergen

**Labels:** `admin`, `feature`, `medium`

---

### Issue 12: Lernfortschritt-Tracking
**Titel:** `[FEATURE] Echtes Lernfortschritt-Tracking implementieren`

**Beschreibung:**
Die Seite `/lernfortschritt` zeigt Fortschrittsbalken mit statischen Mock-Daten. Echtes Tracking fehlt.

**Aufgaben:**
- API `POST /api/lessons/[id]/complete` (Lektion als abgeschlossen markieren)
- Fortschritt pro Kurs berechnen
- Zertifikat ausstellen bei 100% Abschluss
- Fortschritt in Datenbank persistent speichern

**Labels:** `feature`, `backend`, `medium`

---

### Issue 13: Profil-Bearbeitung
**Titel:** `[FEATURE] Profil-Bearbeitung mit echtem Backend`

**Beschreibung:**
Profilseite `/profil` erlaubt Bearbeitungen, speichert aber nichts. Änderungen gehen nach Reload verloren.

**Aufgaben:**
- API `PUT /api/user/profile` erstellen
- Avatar-Upload (mit Cloudinary oder lokalem Storage)
- Passwort ändern (mit Bestätigung des alten Passworts)
- E-Mail-Änderung (mit Bestätigungs-E-Mail)

**Labels:** `feature`, `backend`, `medium`

---

### Issue 14: Kurssuche und Filterung verbessern
**Titel:** `[UX] Kurse-Suche mit Volltextsuche implementieren`

**Beschreibung:**
Auf `/kurse` gibt es Kategorie- und Level-Filter, aber keine Texteingabe-Suche. Die Filterung ist nur clientseitig.

**Aufgaben:**
- Suchfeld im Kurse-Header hinzufügen
- Server-seitige Suche/Filterung implementieren
- Suchergebnisse mit URL-Parametern speicherbar machen
- Keine Kurse gefunden-Zustand verbessern

**Labels:** `ux`, `feature`, `medium`

---

## 🔵 Niedrig (LOW)

### Issue 15: Design – Loading States
**Titel:** `[UX] Loading States und Skeleton Screens hinzufügen`

**Beschreibung:**
Beim Laden von Seiten gibt es keine visuellen Rückmeldungen. Nutzer sehen leere Bereiche.

**Aufgaben:**
- Skeleton-Loader-Komponente erstellen
- Loading States für Datenabruf-Seiten
- `loading.tsx` für Next.js App Router
- Optimistische UI-Updates

**Labels:** `ux`, `design`, `low`

---

### Issue 16: Fehlerbehandlung verbessern
**Titel:** `[UX] Error Boundaries und 404/500-Seiten`

**Beschreibung:**
Bei Fehlern gibt es keine nutzerfreundlichen Fehlermeldungen.

**Aufgaben:**
- `error.tsx` für App Router erstellen
- Benutzerdefinierte 404-Seite (`not-found.tsx`)
- Error Boundary für kritische Komponenten
- Toast-Notifications-System (z.B. mit `react-hot-toast`)

**Labels:** `ux`, `design`, `low`

---

### Issue 17: E-Mail-Verifizierung
**Titel:** `[AUTH] E-Mail-Verifizierung bei Registrierung`

**Beschreibung:**
Neue Nutzer sollten ihre E-Mail-Adresse bestätigen müssen.

**Aufgaben:**
- Verifikations-Token generieren und per E-Mail senden
- API-Route `GET /api/auth/verify-email` 
- Account erst nach Verifikation aktivieren

**Labels:** `auth`, `backend`, `low`

---

### Issue 18: Sicherheits-Verbesserungen
**Titel:** `[SECURITY] Rate-Limiting, CSRF-Schutz und Security Headers`

**Beschreibung:**
Die Plattform hat keine expliziten Sicherheitsmassnahmen für Produktionsbetrieb.

**Aufgaben:**
- Rate-Limiting für API-Routen (`next-rate-limit`)
- Security Headers in `next.config.mjs`
- Input-Validierung mit `zod`
- CORS-Konfiguration
- Next.js auf aktuelle Version aktualisieren (wegen Storage-Vulnerability)

**Labels:** `security`, `backend`, `low`

---

### Issue 19: Analytik und Monitoring
**Titel:** `[FEATURE] Analytics und Performance-Monitoring`

**Beschreibung:**
Keine Nutzerstatistiken oder Fehler-Tracking vorhanden.

**Aufgaben:**
- Vercel Analytics oder Plausible einbinden
- Fehler-Tracking (Sentry)
- Admin-Dashboard mit echten Statistiken verbinden
- E-Mail-Öffnungsraten tracken

**Labels:** `feature`, `analytics`, `low`

---

### Issue 20: Mobile Navigation verbessern
**Titel:** `[UX] Mobile Sidebar für Mitglieder- und Admin-Bereich`

**Beschreibung:**
Die Sidebars in Mitglieder- und Admin-Bereich sind auf Mobile nicht sichtbar/zugänglich.

**Aufgaben:**
- Hamburger-Menü für Member-Sidebar auf Mobile
- Hamburger-Menü für Admin-Sidebar auf Mobile
- Overlay bei geöffneter Sidebar
- Touch-Gesten (Swipe to close)

**Labels:** `ux`, `mobile`, `design`, `low`

---

## Zusammenfassung

| Priorität | Anzahl | Bereich |
|---|---|---|
| 🔴 Kritisch | 4 | Auth, Datenbank, Einschreibung |
| 🟠 Hoch | 5 | Zahlungen, E-Mail, Video, KI, OAuth |
| 🟡 Mittel | 6 | Admin, Tracking, Profil, Suche |
| 🔵 Niedrig | 5 | UX, Sicherheit, Analytics, Mobile |
| **Gesamt** | **20** | |

---

*Generiert am 2026-03-19 durch Codebase-Analyse der Arkanum Akademie Plattform.*
