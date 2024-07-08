import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PaginatorModule } from 'src/paginator/paginator.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Comment, CommentSchema } from './schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema}, 
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema } 
    ]),
    CloudinaryModule,
    PaginatorModule,
    NestjsFormDataModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
