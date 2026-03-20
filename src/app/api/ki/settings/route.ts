import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { KI_ALLOWED_MODELS, KI_SYSTEM_PROMPT_MAX_LENGTH } from '@/lib/kiConstants';

const DEFAULT_SETTINGS = {
  id: 'default',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt:
    'Du bist ein hilfreicher KI-Assistent für die Arkanum Akademie. ' +
    'Du beantwortest Fragen über Metaphysik, Astrologie, Hermetik, Schamanismus und andere spirituelle Themen. ' +
    'Beziehe dich dabei auf die Kursinhalte der Akademie. Antworte immer auf Deutsch.',
  enabled: true,
  knowledgeBase: true,
};

/**
 * GET /api/ki/settings
 * Returns the current KI settings (defaults if none saved yet).
 * Requires admin role.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }
  if ((session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Keine Berechtigung.' }, { status: 403 });
  }

  try {
    const settings = await prisma.kiSettings.findUnique({ where: { id: 'default' } });
    return NextResponse.json({ settings: settings ?? DEFAULT_SETTINGS });
  } catch (error) {
    console.error('[ki/settings GET] Fehler:', error);
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

/**
 * PUT /api/ki/settings
 * Saves KI settings (upsert with id = 'default').
 * Requires admin role.
 */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }
  if ((session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Keine Berechtigung.' }, { status: 403 });
  }

  let body: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    enabled?: boolean;
    knowledgeBase?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige JSON-Anfrage.' }, { status: 400 });
  }

  const ALLOWED_MODELS: readonly string[] = KI_ALLOWED_MODELS;

  // Validate and sanitize inputs
  const model =
    typeof body.model === 'string' && ALLOWED_MODELS.includes(body.model)
      ? body.model
      : DEFAULT_SETTINGS.model;

  const temperature =
    typeof body.temperature === 'number' &&
    body.temperature >= 0 &&
    body.temperature <= 1
      ? body.temperature
      : DEFAULT_SETTINGS.temperature;

  const maxTokens =
    typeof body.maxTokens === 'number' &&
    Number.isInteger(body.maxTokens) &&
    body.maxTokens >= 256 &&
    body.maxTokens <= 4096
      ? body.maxTokens
      : DEFAULT_SETTINGS.maxTokens;

  const systemPrompt =
    typeof body.systemPrompt === 'string' && body.systemPrompt.trim().length > 0
      ? body.systemPrompt.trim().slice(0, KI_SYSTEM_PROMPT_MAX_LENGTH)
      : DEFAULT_SETTINGS.systemPrompt;

  const enabled = typeof body.enabled === 'boolean' ? body.enabled : DEFAULT_SETTINGS.enabled;
  const knowledgeBase =
    typeof body.knowledgeBase === 'boolean' ? body.knowledgeBase : DEFAULT_SETTINGS.knowledgeBase;

  try {
    const settings = await prisma.kiSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', model, temperature, maxTokens, systemPrompt, enabled, knowledgeBase },
      update: { model, temperature, maxTokens, systemPrompt, enabled, knowledgeBase },
    });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('[ki/settings PUT] Fehler:', error);
    return NextResponse.json(
      { error: 'Einstellungen konnten nicht gespeichert werden.' },
      { status: 500 }
    );
  }
}
