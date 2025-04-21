type StoreType = 'PDV' | 'LOJA';

class Preco {
  prazo: string;
  price: string;
  description: string;
}

export class ResponseStoreDto {
  name: string;
  city: string;
  postalCode: string;
  type: StoreType;
  distance: string;
  distanceValue?: number;
  value: Preco[];
}
