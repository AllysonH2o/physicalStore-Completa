import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ResponseStoreDto } from './dtos/response-store.dto';
import { Store } from './schemas/store.schema';

@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post()
  createStore(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  async findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  @Get(':postalCode')
  async findByCep(
    @Param('postalCode') postalCode: string,
  ): Promise<ResponseStoreDto[]> {
    return this.storeService.findByCep(postalCode);
  }
}
