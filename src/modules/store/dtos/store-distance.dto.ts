import { ApiProperty } from '@nestjs/swagger';
import { StoreDto } from './store.dto';

class Preco {
  prazo: string;
  price: string;
  description: string;
}

export class StoreDistanceDto extends StoreDto {
  @ApiProperty({
    description: 'Distancia da loja',
    example: '100 km',
  })
  distance?: string;

  distanceValue?: number;

  @ApiProperty({
    description: 'valor do frete',
    example: [
      {
        prazo: '9 dias úteis',
        price: 'R$ 25.41',
        description: 'PAC',
      },
      {
        prazo: '5 dias úteis',
        price: 'R$ 36.29',
        description: 'SEDEX',
      },
    ],
  })
  value?: Preco[];
}
