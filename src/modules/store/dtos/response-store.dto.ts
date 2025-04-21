type StoreType = 'PDV' | 'LOJA';

export class ResponseStoreDto {
  name: string;
  city: string;
  postalCode: string;
  type: StoreType;
  distance: string;
  distanceValue?: number;
}
