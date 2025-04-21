import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ResponseStoreDto } from './dtos/response-store.dto';
import { ViaCepService } from 'src/common/external-apis/viaCep/viacep.service';
import { GoogleService } from 'src/common/external-apis/google/google.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    private readonly viaCepService: ViaCepService,
    private readonly googleService: GoogleService,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const { postalCode } = createStoreDto;

    try {
      const viaCep = await this.viaCepService.viaCep(postalCode);

      if (viaCep.erro) throw new Error('cep não encontrado');

      const {
        logradouro: address,
        bairro: district,
        localidade: city,
        uf: state,
      } = viaCep;

      const addressGoogle = `${address.replace(/ /g, '+')},+${city.replace(
        / /g,
        '+',
      )},+${state}`;

      const coords = await this.googleService.getCoords(addressGoogle);

      const createStore: Store = {
        storeName: createStoreDto.storeName,
        latitude: coords.lat,
        longitude: coords.lng,
        address,
        city,
        district,
        state,
        type: createStoreDto.type,
        postalCode: viaCep.cep,
        telephoneNumber: createStoreDto.telephoneNumber,
        emailAddress: createStoreDto.emailAddress,
      };

      const newStore = new this.storeModel(createStore);
      return newStore.save();
    } catch (error) {
      throw new Error('cep não encontrado');
    }
  }

  async findAll(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async findByCep(postalCode: string): Promise<ResponseStoreDto[]> {
    try {
      const viaCep = await this.viaCepService.viaCep(postalCode);

      if (viaCep.erro) throw new Error('cep não encontrado');

      const origin = `${viaCep.logradouro.replace(/ /g, '+')},${viaCep.uf}`;

      const stores = await this.storeModel.find().exec();

      const destinations = stores
        .map((store) => `${store.address.replace(/ /g, '+')},${store.state}`)
        .join('|');

      const distance = await this.googleService.getDistance(
        origin,
        destinations,
      );

      const result: ResponseStoreDto[] = [];

      for (let i = 0; i < stores.length; i++) {
        const store = {
          name: stores[i].storeName,
          city: stores[i].city,
          postalCode: stores[i].postalCode,
          type: stores[i].type,
          distance: distance[i].distance.text,
          distanceValue: distance[i].distance.value,
        };
        result.push(store);
      }

      result.sort((a, b) => a.distanceValue! - b.distanceValue!);

      result.forEach((store) => delete store.distanceValue);

      return result;
    } catch (error) {
      throw new Error('cep não encontrado');
    }
  }
}
