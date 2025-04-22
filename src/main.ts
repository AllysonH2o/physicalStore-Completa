import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Minha API')
    .setDescription('Documentação da minha API NestJS')
    .setVersion('1.0')
    .addTag('stores')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const logger = app.get('Logger');

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    logger.info(`Servidor rodando na porta ${port}`);
  });
}
bootstrap();
