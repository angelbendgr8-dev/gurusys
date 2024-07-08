import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class CreatePostDto {
  @ApiProperty()
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
  banner: MemoryStoredFile;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  groupId: string;

}
export class CommentOnPostDto {
  
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  post: Types.ObjectId;

}
export class ReplyACommentDto {
  
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  commentId: string;

}
