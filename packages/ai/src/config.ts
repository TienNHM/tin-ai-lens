export type AiProviderName = "openai" | "anthropic" | "google" | "openrouter";

/** Providers supported for community BYOK (extension). */
export type ByokProviderName = "openai" | "google";

export interface AiRuntimeConfig {
  provider: AiProviderName;
  model: string;
  /** Hard timeout for a single LLM call (ms). */
  timeoutMs: number;
  /** Max characters of markdown sent to the model. */
  maxMarkdownChars: number;
  /** Below this length → insufficient (after trim). */
  minMarkdownChars: number;
  apiKeys: {
    openai?: string;
    anthropic?: string;
    google?: string;
    openrouter?: string;
  };
}

export const DEFAULT_MODELS: Record<AiProviderName, string> = {
  openai: "gpt-4.1-mini",
  anthropic: "claude-sonnet-4-20250514",
  google: "gemini-2.5-flash",
  openrouter: "openai/gpt-4.1-mini",
};

function readProvider(raw: string | undefined): AiProviderName {
  const value = (raw ?? "openai").toLowerCase();
  if (
    value === "openai" ||
    value === "anthropic" ||
    value === "google" ||
    value === "openrouter"
  ) {
    return value;
  }
  throw new Error(
    `Unsupported AI_PROVIDER "${raw}". Use openai | anthropic | google | openrouter.`,
  );
}

/**
 * Build runtime config from a user-supplied API key (BYOK / extension).
 * Does not read process.env.
 */
export function configFromUserKey(input: {
  provider: ByokProviderName;
  apiKey: string;
  model?: string;
  timeoutMs?: number;
}): AiRuntimeConfig {
  const apiKey = input.apiKey.trim();
  if (!apiKey) {
    throw new Error("API key is required");
  }

  const provider = input.provider;
  return {
    provider,
    model: input.model?.trim() || DEFAULT_MODELS[provider],
    timeoutMs: input.timeoutMs ?? 45_000,
    maxMarkdownChars: 24_000,
    minMarkdownChars: 120,
    apiKeys: {
      openai: provider === "openai" ? apiKey : undefined,
      google: provider === "google" ? apiKey : undefined,
    },
  };
}

/**
 * Load runtime config from environment.
 * Never hardcodes a single vendor into call sites — provider is always config-driven.
 */
export function loadAiConfig(env: NodeJS.ProcessEnv = process.env): AiRuntimeConfig {
  const provider = readProvider(env.AI_PROVIDER);
  const model = env.AI_MODEL?.trim() || DEFAULT_MODELS[provider];

  return {
    provider,
    model,
    timeoutMs: Number(env.AI_TIMEOUT_MS ?? 45_000),
    maxMarkdownChars: Number(env.AI_MAX_MARKDOWN_CHARS ?? 24_000),
    minMarkdownChars: Number(env.AI_MIN_MARKDOWN_CHARS ?? 120),
    apiKeys: {
      openai: env.OPENAI_API_KEY,
      anthropic: env.ANTHROPIC_API_KEY,
      google: env.GOOGLE_GENERATIVE_AI_API_KEY ?? env.GOOGLE_API_KEY,
      openrouter: env.OPENROUTER_API_KEY,
    },
  };
}
