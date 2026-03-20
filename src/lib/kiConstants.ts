/** Allowed OpenAI model identifiers for the KI-Assistent. */
export const KI_ALLOWED_MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'gpt-4',
  'gpt-3.5-turbo',
] as const;

export type KiModel = (typeof KI_ALLOWED_MODELS)[number];

/** Maximum character length for the KI system prompt. */
export const KI_SYSTEM_PROMPT_MAX_LENGTH = 2000;
