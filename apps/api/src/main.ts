import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger as PinoLogger } from "nestjs-pino";

import { AppModule } from "./app.module";

function parseCorsOrigin(raw: string | undefined): boolean | string | string[] {
  if (!raw || raw === "*") return true;
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length <= 1 ? (parts[0] ?? true) : parts;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));

  app.enableCors({
    origin: parseCorsOrigin(process.env.CORS_ORIGIN),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  });

  const swagger = new DocumentBuilder()
    .setTitle("TinAiLens API")
    .setDescription(
      "Ephemeral trust analysis. Explainable signals — not a detector or oracle. Content is not permanently stored.",
    )
    .setVersion("0.1.0")
    .build();
  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, swagger));

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);

  Logger.log(`TinAiLens API listening on http://localhost:${port}`, "Bootstrap");
  Logger.log(`Swagger docs at http://localhost:${port}/docs`, "Bootstrap");
}

void bootstrap();
