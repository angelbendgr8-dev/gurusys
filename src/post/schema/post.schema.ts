import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;
@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'Group' })
  group: Types.ObjectId;

  @Prop({ type: String })
  banner: string;

  @Prop({ type: String })
  content: string;

  @Prop({type: Array<Types.ObjectId>, ref:'User', default: []})
  likes: Array<Types.ObjectId>

  @Prop({type: Number,default: 0})
  likeCount: number

  @Prop({type: Number,default: 0})
  numberOfComment: number

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
