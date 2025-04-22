import { ApiProperty } from '@nestjs/swagger';

type StoreType = 'PDV' | 'LOJA';

export class StoreDto {
  @ApiProperty({
    description: 'Nome da loja',
    example: 'The Dragon',
  })
  name: string;

  @ApiProperty({
    description: 'Cidade da loja',
    example: 'Caruaru',
  })
  city: string;

  @ApiProperty({
    description: 'Cep da loja',
    example: '55000-000',
  })
  postalCode: string;

  @ApiProperty({
    description: 'Tipo da loja',
    example: 'PDV ou LOJA',
  })
  type: StoreType;

  @ApiProperty({
    description: 'pin da loja para mapa',
    example: {
      position: {
        lat: '-8.2825035',
        lng: '-35.9719968',
      },
      title: 'The Dragon',
    },
  })
  pin: {
    position: {
      lat: string;
      lng: string;
    };
    title: string;
  };
}
