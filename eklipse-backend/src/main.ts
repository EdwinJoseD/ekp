import { ValidationPipe } from "@nestjs/common";
import { initSwagger } from "./app.swagger";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors();
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    index: false,
    prefix: "/uploads",
  });
  app.useGlobalPipes(new ValidationPipe());
  initSwagger(app);
  await app.listen(3000);
}
bootstrap();
