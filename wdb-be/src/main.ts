import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'reflect-metadata';
const bodyParser = require('body-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // add specific origins here later
  app.use(bodyParser.json({ limit: '1mb' }));

  const config = new DocumentBuilder()
    .setTitle('wdb api')
    .setDescription('The api for the wdb app')
    .setVersion('1.0')
    .addTag('wdb')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
