import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { CreateStoreDto } from './dtos/create-store.dto';
import { StoreDto } from './dtos/store.dto';
import { StoreDistanceDto } from './dtos/store-distance.dto';
import { ViaCepService } from '../../common/external-apis/viaCep/viacep.service';
import { GoogleService } from '../../common/external-apis/google/google.service';
import { MelhorEnvioService } from '../../common/external-apis/melhorEnvio/melhor-envio.service';

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);

  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    private readonly viaCepService: ViaCepService,
    private readonly googleService: GoogleService,
    private readonly melhorEnvioService: MelhorEnvioService,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<StoreDto> {
    const { postalCode } = createStoreDto;

    const infoStore = await this.getInfo(postalCode);

    const createStore: Store = {
      storeName: createStoreDto.storeName,
      latitude: infoStore.latitude,
      longitude: infoStore.longitude,
      address: infoStore.address,
      city: infoStore.city,
      district: infoStore.district,
      state: infoStore.state,
      type: createStoreDto.type,
      postalCode: infoStore.postalCode,
      telephoneNumber: createStoreDto.telephoneNumber,
      emailAddress: createStoreDto.emailAddress,
    };

    const newStore = new this.storeModel(createStore);
    newStore.save();

    return this.mapResponse(newStore);
  }

  async findAll(): Promise<StoreDto[]> {
    const store = await this.storeModel.find().exec();

    return store.map((store) => this.mapResponse(store));
  }

  async findByCep(postalCode: string): Promise<StoreDistanceDto> {
    const infoStore = await this.getInfo(postalCode);

    const origin = `${infoStore.latitude},${infoStore.longitude}`;

    const stores = await this.storeModel.find().exec();

    const store = await this.getStore(stores, origin, postalCode);

    return store;
  }

  async findById(id: string): Promise<StoreDto> {
    const store = await this.storeModel.findById(id).exec();

    if (!store) throw new NotFoundException(`Loja com ID ${id} não encontrada`);

    return this.mapResponse(store);
  }

  async findByState(state: string): Promise<StoreDto[]> {
    const store = await this.storeModel.find({ state }).exec();

    if (store.length === 0)
      throw new NotFoundException(`Nenhuma loja encontrada no estado ${state}`);

    return store.map((store) => this.mapResponse(store));
  }

  private async getInfo(postalCode: string) {
    const viaCep = await this.viaCepService.viaCep(postalCode);

    if (viaCep.erro) {
      this.logger.error(`Erro ao buscar no cep: ${postalCode}, ${viaCep.erro}`);
      throw new BadRequestException('cep não encontrado');
    }
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

    const infoStore = {
      latitude: coords.lat,
      longitude: coords.lng,
      address,
      city,
      district,
      state,
      postalCode: viaCep.cep,
    };
    return infoStore;
  }

  private async getStore(
    stores: Store[],
    origin: string,
    postalCode: string,
  ): Promise<StoreDistanceDto> {
    const destinations = stores
      .map((store) => `${store.latitude},${store.longitude}`)
      .join('|');

    const distance = await this.googleService.getDistance(origin, destinations);

    const storesDto: StoreDto[] = stores.map((store) =>
      this.mapResponse(store),
    );

    const result: StoreDistanceDto[] = storesDto.map((store, i) => ({
      ...store,
      distance: distance[i].distance.text,
      distanceValue: distance[i].distance.value,
      value: [
        {
          prazo: `${stores[i].shippingTimeInDays} dias úteis`,
          price: `R$ 15,00`,
          description: `Motoboy`,
        },
      ],
    }));

    result.sort((a, b) => a.distanceValue! - b.distanceValue!);

    if (result[0].type === 'LOJA' || result[0].distanceValue! > 50000) {
      const melhorEnvio = await this.melhorEnvioService.getPreco(
        postalCode,
        result[0].postalCode,
      );

      for (let i = 0; i < 2; i++) {
        result[0].value![i] = {
          prazo: `${melhorEnvio[i].delivery_time + stores[0].shippingTimeInDays!} dias úteis`,
          price: `R$ ${melhorEnvio[i].price}`,
          description: `${melhorEnvio[i].name}`,
        };
      }
    }

    result.forEach((store) => delete store.distanceValue);

    return result[0];
  }

  private mapResponse(store: Store): StoreDto {
    return {
      name: store.storeName,
      city: store.city,
      postalCode: store.postalCode,
      type: store.type,
      pin: {
        position: {
          lat: store.latitude,
          lng: store.longitude,
        },
        title: store.storeName,
      },
    };
  }
}
