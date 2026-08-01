import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BadRequestException } from "@nestjs/common";
import { AnalyzeRequestSchema } from "@tin-ai-lens/types";

import { ZodValidationPipe } from "./zod-validation.pipe";

describe("ZodValidationPipe", () => {
  const pipe = new ZodValidationPipe(AnalyzeRequestSchema);

  it("accepts a valid analyze request", () => {
    const result = pipe.transform({
      requestId: "550e8400-e29b-41d4-a716-446655440000",
      url: "https://example.com/article",
      title: "Example",
      markdown: "# Hello\n\nEnough content for a trust analysis pass.",
      extensionVersion: "0.1.0",
    });

    assert.equal(result.title, "Example");
  });

  it("rejects invalid payloads", () => {
    assert.throws(
      () => pipe.transform({ title: "missing fields" }),
      (err: unknown) => err instanceof BadRequestException,
    );
  });
});
