import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { GetCoords } from '../dtos/google-get-coods.dto';
import { getDistance } from '../dtos/google-get-distance.dto';

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
      this.logger.error(`Erro na api GoogleMaps. ${error.message}`);
      throw error;
    }
  }

  async getDistance(
    origin: string,
    destinations: string,
  ): Promise<getDistance[]> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&mode=driving&key=${process.env.API_GOOGLE_KEY}`,
      );
      return response.data.rows[0].elements;
    } catch (error) {
      this.logger.error(`Erro na api GoogleMaps. ${error.message}`);
      throw error;
    }
  }
}
