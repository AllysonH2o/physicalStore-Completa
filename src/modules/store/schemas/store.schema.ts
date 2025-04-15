import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @Prop({ required: true })
  storeName: string;

  // @Prop({ required: true })
  // latitude: string;

  // @Prop({ required: true })
  // longitude: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  type: string; //pdv|loja

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  telephoneNumber: string;

  @Prop({ required: true })
  emailAddress: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
