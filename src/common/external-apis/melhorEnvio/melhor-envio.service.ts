import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { MelhorEnvioDto } from '../dtos/melhorenvio.dto';

@Injectable()
export class MelhorEnvioService {
  private readonly logger = new Logger(MelhorEnvioService.name);

  async getPreco(from: string, to: string): Promise<MelhorEnvioDto[]> {
    const body = {
      from: { postal_code: from },
      to: { postal_code: to },
      products: [
        {
          id: '1',
          width: 15,
          height: 10,
          length: 20,
          weight: 1,
          insurance_value: 0,
          quantity: 1,
        },
      ],
      options: {
        receipt: false,
        own_hand: false,
        insurance_value: 0,
        reverse: false,
        non_commercial: true,
      },
      services: ['1', '2'],
      validate: true,
    };

    const headers = {
      Authorization: `Bearer ${process.env.API_MELHOR_ENVIO_KEY}`,
    };

    try {
      const response = await axios.post(
        `https://melhorenvio.com.br/api/v2/me/shipment/calculate`,
        body,
        { headers },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Erro na api MelhorEnivo. ${error.message}`);
      throw error;
    }
  }
}
