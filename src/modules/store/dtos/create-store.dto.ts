import { IsString, IsEmail, IsIn, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

type StoreType = 'PDV' | 'LOJA';

export class CreateStoreDto {
  @ApiProperty({
    description: 'Nome da loja',
    example: 'The Dragon',
  })
  @IsString()
  storeName: string;

  @ApiProperty({
    description: 'Tipo da loja',
    example: 'PDV ou LOJA',
  })
  @IsIn(['PDV', 'LOJA'])
  type: StoreType;

  @ApiProperty({
    description: 'Cep da loja',
    example: '55000-000',
  })
  @IsString()
  postalCode: string;

  @ApiProperty({
    description: 'Numero da loja',
    example: '(81)94002-8922',
  })
  @IsPhoneNumber('BR')
  telephoneNumber: string;

  @ApiProperty({
    description: 'Email da loja',
    example: 'exemplo@exemplo.com',
  })
  @IsEmail()
  emailAddress: string;
}
