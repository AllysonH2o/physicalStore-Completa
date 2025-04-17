import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store, StoreSchema } from './schemas/store.schema';
import { ExternalApisModule } from 'src/common/external-apis/external-apis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    ExternalApisModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
