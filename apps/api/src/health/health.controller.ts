import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @SkipThrottle()
  @ApiOkResponse({ description: "Liveness probe" })
  getHealth() {
    return {
      status: "ok",
      service: "tin-ai-lens-api",
      timestamp: new Date().toISOString(),
    };
  }
}
