import { IsString, IsEmail, IsIn, IsPhoneNumber } from 'class-validator';

type StoreType = 'PDV' | 'LOJA';

export class CreateStoreDto {
  @IsString()
  storeName: string;

  @IsIn(['PDV', 'LOJA'])
  type: StoreType;

  @IsString()
  postalCode: string;

  @IsPhoneNumber('BR')
  telephoneNumber: string;

  @IsEmail()
  emailAddress: string;
}
