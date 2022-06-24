import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { appInfo } from "./app.information";

const title = appInfo.name;
const description = `Bienvenido(a) ${appInfo.name} v${appInfo.version},
este proyecto pertenece a ${appInfo.company}.Todos los derechos reservados © ${appInfo.creation}.
Publicada el ${appInfo.released}.`;

export const initSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("/api/docs", app, document);
};
