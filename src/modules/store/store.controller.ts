import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ResponseStoreDto } from './dtos/response-store.dto';
import { Store } from './schemas/store.schema';
import { StoreDto } from './dtos/store.dto';

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

  @Get('postalcode/:postalCode')
  async findByCep(
    @Param('postalCode') postalCode: string,
  ): Promise<ResponseStoreDto> {
    return this.storeService.findByCep(postalCode);
  }

  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<StoreDto> {
    return this.storeService.findById(id);
  }

  @Get('state/:state')
  async findByState(@Param('state') state: string): Promise<StoreDto[]> {
    return this.storeService.findByState(state);
  }
}
