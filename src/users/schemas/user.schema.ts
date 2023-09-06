import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;
  
  @Prop({ required: true })
  password: string;

  @Prop()
  age: number;

  name: string;

  @Prop()
  address: string;

  @Prop()
  phone: number;

  @Prop({ required: true , default: true})
  isActive: boolean;

  @Prop()
  createAt: Date;

  @Prop()
  updateAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);