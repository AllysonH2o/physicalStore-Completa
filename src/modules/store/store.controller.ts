import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { StoreDto } from './dtos/store.dto';
import { StoreDistanceDto } from './dtos/store-distance.dto';

@ApiTags('stores')
@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post()
  @ApiOperation({ summary: 'Criar loja' })
  @ApiBody({ type: CreateStoreDto })
  @ApiResponse({
    status: 201,
    description: 'Loja criada com sucesso',
    type: StoreDto,
  })
  createStore(@Body() createStoreDto: CreateStoreDto): Promise<StoreDto> {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as lojas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de lojas retornada com sucesso',
    type: StoreDto,
  })
  async findAll(): Promise<StoreDto[]> {
    return this.storeService.findAll();
  }

  @Get('postalcode/:postalCode')
  @ApiOperation({ summary: 'Listar loja mais proxima ao cep' })
  @ApiParam({
    name: 'postaCode',
    description: 'Cep para achar loja mais proxima',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lojas retornada com sucesso',
    type: StoreDistanceDto,
  })
  @ApiResponse({ status: 400, description: 'Cep não encontrado.' })
  async findByCep(
    @Param('postalCode') postalCode: string,
  ): Promise<StoreDistanceDto> {
    return this.storeService.findByCep(postalCode);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Listar loja por id' })
  @ApiParam({ name: 'id', description: 'Id da loja', required: true })
  @ApiResponse({
    status: 200,
    description: 'Lojas retornada com sucesso',
    type: StoreDto,
  })
  @ApiResponse({ status: 404, description: 'Loja não encontrada.' })
  async findById(@Param('id') id: string): Promise<StoreDto> {
    return this.storeService.findById(id);
  }

  @Get('state/:state')
  @ApiOperation({ summary: 'Listar lojas por estado' })
  @ApiParam({
    name: 'state',
    description: 'Estado para procurar lojas',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de lojas retornada com sucesso',
    type: StoreDto,
  })
  @ApiResponse({ status: 404, description: 'Loja não encontrada no estado.' })
  async findByState(@Param('state') state: string): Promise<StoreDto[]> {
    return this.storeService.findByState(state);
  }
}
