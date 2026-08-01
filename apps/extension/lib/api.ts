import type { AnalyzeRequest, AnalyzeResponse } from "@tin-ai-lens/types";

const DEFAULT_API = "http://localhost:3001";

export function getApiBaseUrl(): string {
  return (
    process.env.PLASMO_PUBLIC_API_URL?.replace(/\/$/, "") || DEFAULT_API
  );
}

export class AnalyzeApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "AnalyzeApiError";
  }
}

export async function postAnalyze(
  request: AnalyzeRequest,
): Promise<AnalyzeResponse> {
  const res = await fetch(`${getApiBaseUrl()}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    let message = `Analyze failed (${res.status})`;
    try {
      const body = (await res.json()) as {
        message?: string | string[];
        error?: { message?: string };
      };
      if (typeof body.error?.message === "string") {
        message = body.error.message;
      } else if (typeof body.message === "string") {
        message = body.message;
      }
    } catch {
      // keep default message
    }
    throw new AnalyzeApiError(message, res.status);
  }

  return (await res.json()) as AnalyzeResponse;
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
