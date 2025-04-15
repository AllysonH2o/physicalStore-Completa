import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ViaCepDto } from './dtos/viacep.dto';
import axios from 'axios';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const { postalCode } = createStoreDto;

    try {
      const result = await axios.get(
        `https://viacep.com.br/ws/${postalCode}/json`,
      );
      const viaCep: ViaCepDto = result.data;

      const createStore: Store = {
        storeName: createStoreDto.storeName,
        address: viaCep.logradouro,
        city: viaCep.localidade,
        district: viaCep.bairro,
        state: viaCep.estado,
        type: createStoreDto.type,
        country: 'Brasil',
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
}
