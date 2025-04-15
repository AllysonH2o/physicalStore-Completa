import { Controller, Post, Body, Get } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dtos/create-store.dto';
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
}
