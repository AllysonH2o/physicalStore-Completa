import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { GetCoords } from '../dtos/google-get-coods.dto';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);

  async getCoords(address: string): Promise<GetCoords> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.API_GOOGLE_KEY}`,
      );
      return response.data.results[0].geometry.location;
    } catch (error) {
      this.logger.error(
        `Erro na api GoogleMaps com o endereço ${address}: ${error.message}`,
      );
      throw error;
    }
  }
}
