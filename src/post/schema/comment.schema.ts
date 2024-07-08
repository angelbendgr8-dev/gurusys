import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;
@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Array<Types.ObjectId>, ref: 'User', default: [] })
  likes: Array<Types.ObjectId>;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  parentComment: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  replies: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  replyCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
