import { Module } from '@nestjs/common';
import { ViaCepService } from './viaCep/viacep.service';
import { GoogleService } from './google/google.service';
import { MelhorEnvioService } from './melhorEnvio/melhor-envio.service';

@Module({
  providers: [ViaCepService, GoogleService, MelhorEnvioService],
  exports: [ViaCepService, GoogleService, MelhorEnvioService],
})
export class ExternalApisModule {}
