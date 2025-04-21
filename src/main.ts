import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get('Logger');

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    logger.info(`Servidor rodando na porta ${port}`);
  });
}
bootstrap();
