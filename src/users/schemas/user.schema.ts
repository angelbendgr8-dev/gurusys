import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  
  @Prop({ type: String, default: null })
  username: string;

  @Prop()
  email: string;

  @Prop({ defaultValue: null })
  mobileNumber: string;

  @Prop({ type: Boolean, default: true })
  emailVerified: boolean;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: true })
  mobileVerified: boolean;

  @Prop({ type: Boolean, default: true })
  terms: boolean;


  @Prop({type: Array<Types.ObjectId>, ref:'Post', default: []})
  savedPosts: Array<Types.ObjectId>

  @Prop({type: Number,default: 0})
  savedPostsCount: number

  @Prop()
  password: string;


  @Prop({ type: String, enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop({ type: String, default: null })
  profilePics: string;
  @Prop({ type: String, default: null })
  fcmToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
