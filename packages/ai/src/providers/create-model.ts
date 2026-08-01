import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";

import type { AiProviderName, AiRuntimeConfig } from "../config.js";

function requireKey(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing API key for provider: set ${name}`);
  }
  return value;
}

/**
 * Build a provider-agnostic LanguageModel from runtime config.
 */
export function createLanguageModel(config: AiRuntimeConfig): LanguageModel {
  const { provider } = config;

  if (provider === "openai") {
    const openai = createOpenAI({
      apiKey: requireKey("OPENAI_API_KEY", config.apiKeys.openai),
    });
    return openai(config.model);
  }

  if (provider === "anthropic") {
    const anthropic = createAnthropic({
      apiKey: requireKey("ANTHROPIC_API_KEY", config.apiKeys.anthropic),
    });
    return anthropic(config.model);
  }

  if (provider === "google") {
    const google = createGoogleGenerativeAI({
      apiKey: requireKey("GOOGLE_GENERATIVE_AI_API_KEY", config.apiKeys.google),
    });
    return google(config.model);
  }

  if (provider === "openrouter") {
    const openrouter = createOpenRouter({
      apiKey: requireKey("OPENROUTER_API_KEY", config.apiKeys.openrouter),
    });
    return openrouter(config.model);
  }

  const _unsupported: never = provider;
  throw new Error(`Unhandled provider: ${String(_unsupported)}`);
}

export type { AiProviderName };
