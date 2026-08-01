import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import type { AnalyzeRequest, AnalyzeResponse } from "@tin-ai-lens/types";

import { analyzeRequestPipe } from "../common/zod-validation.pipe";
import { AnalyzeService } from "./analyze.service";

@ApiTags("analyze")
@Controller("analyze")
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @UsePipes(analyzeRequestPipe())
  @ApiOperation({
    summary: "Analyze page content",
    description:
      "Returns an explainable Trust Report. Ephemeral — content is not permanently stored. Never returns absolute true/false/AI verdicts.",
  })
  @ApiBody({
    description: "Extracted page payload from the extension",
    schema: {
      type: "object",
      required: ["requestId", "url", "title", "markdown", "extensionVersion"],
      properties: {
        requestId: { type: "string", format: "uuid" },
        url: { type: "string", format: "uri" },
        title: { type: "string" },
        markdown: { type: "string" },
        language: { type: "string" },
        extensionVersion: { type: "string" },
        extractedMeta: {
          type: "object",
          properties: {
            author: { type: "string" },
            byline: { type: "string" },
            siteName: { type: "string" },
            publishedAt: { type: "string" },
          },
        },
      },
    },
  })
  @ApiTooManyRequestsResponse({ description: "Rate limit exceeded" })
  async analyze(@Body() body: AnalyzeRequest): Promise<AnalyzeResponse> {
    return this.analyzeService.analyze(body);
  }
}
