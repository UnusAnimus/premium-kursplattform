import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, subject, message } = body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Bitte gib eine gültige E-Mail-Adresse ein.' },
        { status: 400 }
      );
    }

    // Log the contact request (in production this would be sent via email or stored in DB)
    console.log('[kontakt] Neue Kontaktanfrage:', {
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: 'Nachricht erfolgreich gesendet.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[kontakt] Fehler:', error);
    return NextResponse.json(
      { error: 'Ein interner Fehler ist aufgetreten. Bitte versuche es erneut.' },
      { status: 500 }
    );
  }
}
