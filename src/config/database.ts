import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { LoggerModule } from './logger/logger.module';

export const databaseConfig = MongooseModule.forRootAsync({
  imports: [ConfigModule, LoggerModule],
  inject: [ConfigService, 'Logger'],
  useFactory: async (configService: ConfigService, logger: Logger) => {
    const mongoUri = configService.get<string>('MONGO_URI');

    try {
      await mongoose.connect(mongoUri!);
      logger.info('Conectado com o Banco de dados');
    } catch (error) {
      logger.error('Erro ao conectar com o Banco de dados', error);
      throw error;
    }

    return { uri: mongoUri };
  },
});
