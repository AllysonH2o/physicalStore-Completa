import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { ViaCepDto } from '../dtos/viacep.dto';

@Injectable()
export class ViaCepService {
  private readonly logger = new Logger(ViaCepService.name);

  async viaCep(postalCode: string): Promise<ViaCepDto> {
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${postalCode}/json`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Erro na api viaCep ao acessar o cep ${postalCode}: ${error.message}`,
      );
      throw new InternalServerErrorException('Ocorreu um erro inesperado');
    }
  }
}
