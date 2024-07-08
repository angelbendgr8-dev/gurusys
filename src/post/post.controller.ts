import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { CommentOnPostDto, CreatePostDto, ReplyACommentDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Types } from 'mongoose';
import { QueryDto } from './dto/query.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { OrGuard } from '@nest-lab/or-guard';

@Controller('post')
@ApiTags('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @UseGuards(OrGuard([JwtAuthGuard]))
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    const {user} = req
    return this.postService.create(createPostDto,user);
  }
  @Get('/like/:id')
  @UseGuards(JwtAuthGuard)
  likePost(@Param() id: string, @Req() req) {
    const {user} = req
    return this.postService.likeAPost(id,user);
  }
  @Get('/unlike/:id')
  @UseGuards(JwtAuthGuard)
  unlikePost(@Param() id: string,  @Req() req) {
    const {user} = req
    return this.postService.unlikeAPost(id,user);
  }
  @Post('/comment')
  @UseGuards(JwtAuthGuard)
  comment(@Body() data: CommentOnPostDto, @Req() req) {
    const {user} = req
    return this.postService.commentOnPost(data,user);
  }
  @Post('/comment/reply')
  @UseGuards(JwtAuthGuard)
  replyAComment(@Body() data: ReplyACommentDto, @Req() req) {
    const {user} = req
    return this.postService.replyAComment(data,user);
  }
  @Get('comment/replies/:id')
  @UseGuards(JwtAuthGuard)
  getReplies(@Param() commentId: string,@Query() query: QueryDto,@Req() req) {
    const {user} = req
    return this.postService.getReplyOnComment(commentId,query,);
  }
  @Get('comments/:id')
  @UseGuards(JwtAuthGuard)
  getComments(@Param() postId: string,@Query() query: QueryDto,@Req() req) {
    const {user} = req
    return this.postService.getCommentsOnPost(postId,query,);
  }
  @Put('comments/like/:id')
  @UseGuards(JwtAuthGuard)
  likeComment(@Param() commentId: string,@Req() req) {
    const {user} = req
    return this.postService.likeAComment(commentId,user);
  }
  @Put('comments/unlike/:id')
  @UseGuards(JwtAuthGuard)
  unlikeComment(@Param() commentId: string,@Req() req) {
    const {user} = req
    return this.postService.unlikeAComment(commentId,user);
  }
  @Put('like-reply/:id')
  @UseGuards(JwtAuthGuard)
  likeReply(@Param() replyId: string,@Req() req) {
    const {user} = req
    return this.postService.likeAReply(replyId,user);
  }
  @Put('unlike-reply/:id')
  @UseGuards(JwtAuthGuard)
  unlikeReply(@Param() replyId: string,@Req() req) {
    const {user} = req
    return this.postService.unlikeAReply(replyId,user);
  }
  @Put('save/:id')
  @UseGuards(JwtAuthGuard)
  savePost(@Param() postId:string,@Req() req) {
    const {user} = req
    return this.postService.saveAPost(postId,user._id);
  }
  @Put('unsave/:id')
  @UseGuards(JwtAuthGuard)
  unsavePost(@Param() postId: string,@Req() req) {
    const {user} = req
    return this.postService.unSaveAPost(postId,user._id);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
