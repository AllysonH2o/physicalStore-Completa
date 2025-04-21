import { StoreDto } from './store.dto';

export class ResponseStoreDto {
  store: StoreDto;
  limit: number;
  offset: number;
  total: number;
}
