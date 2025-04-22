import { Module, Global } from '@nestjs/common';
import { loggerConfig } from './logger.config';

@Global()
@Module({
  providers: [
    {
      provide: 'Logger',
      useValue: loggerConfig,
    },
  ],
  exports: ['Logger'],
})
export class LoggerModule {}
