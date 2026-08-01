import {
  analyzeContent,
  configFromUserKey,
} from "@tin-ai-lens/ai";
import type { AnalyzeRequest, AnalyzeResponse } from "@tin-ai-lens/types";

import { getByokSettings } from "~/lib/byok";

export class ByokMissingError extends Error {
  constructor(message = "API key required") {
    super(message);
    this.name = "ByokMissingError";
  }
}

/**
 * Analyze in the extension using the user's BYOK settings (no TinAiLens server).
 */
export async function analyzeLocal(
  request: AnalyzeRequest,
): Promise<AnalyzeResponse> {
  const settings = await getByokSettings();
  if (!settings) {
    throw new ByokMissingError();
  }

  const config = configFromUserKey({
    provider: settings.provider,
    apiKey: settings.apiKey,
  });

  return analyzeContent(request, {
    config,
    exposeErrorDetails: true,
  });
}

export function newRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
