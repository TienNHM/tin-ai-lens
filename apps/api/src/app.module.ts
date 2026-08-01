import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";

import { AnalyzeModule } from "./analyze/analyze.module";
import { HealthController } from "./health/health.controller";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        transport:
          process.env.NODE_ENV === "production"
            ? undefined
            : { target: "pino-pretty", options: { singleLine: true } },
        // Privacy: never log raw analyzed page bodies
        serializers: {
          req(req: { id?: string; method?: string; url?: string }) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
            };
          },
        },
        customProps: () => ({ service: "tin-ai-lens-api" }),
        autoLogging: {
          ignore: (req) => req.url === "/health",
        },
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: "default",
        ttl: Number(process.env.THROTTLE_TTL_MS ?? 60_000),
        limit: Number(process.env.THROTTLE_LIMIT ?? 20),
      },
    ]),
    AnalyzeModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
