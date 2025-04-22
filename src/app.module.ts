import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './config/logger/logger.module';
import { StoreModule } from './modules/store/store.module';
import { databaseConfig } from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    StoreModule,
    databaseConfig,
  ],
})
export class AppModule {}
