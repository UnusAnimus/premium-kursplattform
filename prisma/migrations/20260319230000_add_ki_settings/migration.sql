-- CreateTable
CREATE TABLE "ki_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "model" TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "maxTokens" INTEGER NOT NULL DEFAULT 2048,
    "systemPrompt" TEXT NOT NULL DEFAULT 'Du bist ein hilfreicher KI-Assistent für die Arkanum Akademie. Du beantwortest Fragen über Metaphysik, Astrologie, Hermetik, Schamanismus und andere spirituelle Themen. Beziehe dich dabei auf die Kursinhalte der Akademie. Antworte immer auf Deutsch.',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "knowledgeBase" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ki_settings_pkey" PRIMARY KEY ("id")
);
