import { Injectable, Logger } from "@nestjs/common";
import { analyzeContent } from "@tin-ai-lens/ai";
import type { AnalyzeRequest, AnalyzeResponse } from "@tin-ai-lens/types";

@Injectable()
export class AnalyzeService {
  private readonly logger = new Logger(AnalyzeService.name);

  /**
   * Runs ephemeral trust analysis. Does not persist page content.
   */
  async analyze(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    const started = Date.now();
    const response = await analyzeContent(request);

    this.logger.log({
      msg: "analyze_complete",
      requestId: request.requestId,
      status: response.status,
      latencyMs: Date.now() - started,
      markdownChars: request.markdown.length,
      // Privacy: do not log title/url/body content by default
    });

    return response;
  }
}
