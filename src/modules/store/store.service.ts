import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { CreateStoreDto } from './dtos/create-store.dto';
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
        estado: state,
        uf,
      } = viaCep;

      const addressGoogle = `${address.replace(/ /g, '+')},+${city.replace(
        / /g,
        '+',
      )},+${uf}`;

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
}
