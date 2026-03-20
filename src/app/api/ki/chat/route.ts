import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rateLimit';
import { KI_ALLOWED_MODELS, KI_SYSTEM_PROMPT_MAX_LENGTH } from '@/lib/kiConstants';

const DEFAULT_SYSTEM_PROMPT =
  'Du bist ein hilfreicher KI-Assistent für die Arkanum Akademie. ' +
  'Du beantwortest Fragen über Metaphysik, Astrologie, Hermetik, Schamanismus und andere spirituelle Themen. ' +
  'Beziehe dich dabei auf die Kursinhalte der Akademie. Antworte immer auf Deutsch.';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * POST /api/ki/chat
 *
 * Body: { messages: ChatMessageInput[] }
 *  – `messages` is the full conversation history (user + assistant turns).
 *
 * Requires an authenticated session.
 * Applies per-user rate limiting (20 requests / hour).
 * Calls the OpenAI Chat Completions API using the stored KI settings.
 */
export async function POST(req: NextRequest) {
  // --- Auth ---
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }

  const userId = session.user.id;

  // --- Rate limiting ---
  const rateLimitResult = checkRateLimit(`ki-chat:${userId}`);
  if (!rateLimitResult.allowed) {
    const retryAfterSec = Math.ceil(rateLimitResult.retryAfterMs / 1000);
    const retryMsg =
      retryAfterSec < 60
        ? `${retryAfterSec} Sekunden`
        : `${Math.ceil(retryAfterSec / 60)} Minuten`;
    return NextResponse.json(
      {
        error: `Zu viele Anfragen. Bitte warte ${retryMsg} und versuche es erneut.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSec) },
      }
    );
  }

  // --- Parse body ---
  let messages: ChatMessageInput[];
  try {
    const body = await req.json();
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: 'Ungültige Anfrage: messages fehlt.' }, { status: 400 });
    }
    messages = body.messages;
  } catch {
    return NextResponse.json({ error: 'Ungültige JSON-Anfrage.' }, { status: 400 });
  }

  // --- Check OpenAI API key ---
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'KI-Assistent ist derzeit nicht verfügbar (API-Schlüssel fehlt).' },
      { status: 503 }
    );
  }

  // --- Load KI settings ---
  let settings: {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    enabled: boolean;
  };

  try {
    const dbSettings = await prisma.kiSettings.findUnique({ where: { id: 'default' } });
    settings = dbSettings
      ? {
          model: dbSettings.model,
          temperature: dbSettings.temperature,
          maxTokens: dbSettings.maxTokens,
          systemPrompt: dbSettings.systemPrompt,
          enabled: dbSettings.enabled,
        }
      : {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 2048,
          systemPrompt: DEFAULT_SYSTEM_PROMPT,
          enabled: true,
        };
  } catch {
    // If DB is unavailable, fall back to defaults
    settings = {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      enabled: true,
    };
  }

  // --- Check if KI is enabled ---
  if (!settings.enabled) {
    return NextResponse.json(
      { error: 'Der KI-Assistent ist derzeit deaktiviert.' },
      { status: 503 }
    );
  }

  // --- Validate message content ---
  const sanitizedMessages = messages
    .filter(
      (m) =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .map((m) => ({ role: m.role, content: m.content.trim() }));

  if (sanitizedMessages.length === 0) {
    return NextResponse.json({ error: 'Keine gültige Nachricht gefunden.' }, { status: 400 });
  }

  // --- Call OpenAI ---
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        messages: [
          { role: 'system', content: settings.systemPrompt },
          ...sanitizedMessages,
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[ki/chat] OpenAI API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'KI-Assistent konnte keine Antwort generieren. Bitte versuche es erneut.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';

    if (!content) {
      return NextResponse.json(
        { error: 'Leere Antwort vom KI-Dienst erhalten.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('[ki/chat] Fetch error:', error);
    return NextResponse.json(
      { error: 'KI-Assistent ist derzeit nicht erreichbar. Bitte versuche es später erneut.' },
      { status: 503 }
    );
  }
}
