import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SupportDocument = HydratedDocument<Support>;

@Schema({ timestamps: true })
export class Support {
  @Prop({ type: String, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: String, default: null })
  reason: string;

  @Prop()
  description: string;
}

export const SupportSchema = SchemaFactory.createForClass(Support);
