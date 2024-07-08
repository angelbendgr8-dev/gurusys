import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import {
  CommentOnPostDto,
  CreatePostDto,
  ReplyACommentDto,
} from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginatorService } from 'src/paginator/paginator.service';
import { isEmpty } from 'lodash';
import { formatedResponse } from 'src/utils/helpers';
import { Post, PostDocument } from './schema/post.schema';
import { GeneralResponse } from 'src/responses/general.responses';
import { Comment, CommentDocument } from './schema/comment.schema';
import { QueryDto } from './dto/query.dto';
@Injectable()
export class PostService {
  constructor(
    @InjectModel(User.name)
    private userRepository: Model<User>,
    @InjectModel(Post.name)
    private postRepository: Model<PostDocument>,

    @InjectModel(Comment.name)
    private commentRepository: Model<CommentDocument>,

    private cloudinaryService: CloudinaryService,
    private paginator: PaginatorService,
  ) {}
  async create(data: CreatePostDto, user) {
    const { banner, ...rest } = data;
    
    const uploadResponse = await this.cloudinaryService.uploadImage(
      data.banner,
      'prescription',
    );
    const { secure_url } = uploadResponse;

    const resource = await this.postRepository.create({
      user: user._id,
      ...rest,
      banner: secure_url,
    });
    return formatedResponse(
      'Resource created successfully',
      200,
      'success',
      resource,
    );
  }

  public async getCommentsOnPost(
    postId: string,
    params: QueryDto,
  ): Promise<{ data: Comment[]; meta: any }> {
    const posts = this.commentRepository
      .find({ post: new Types.ObjectId(postId), parentComment: null })
      .sort({ createdAt: -1 })
      .populate({ path: 'user', model: 'User',select: 'username profilePics _id', });
    const { data, meta } = await this.paginator.paginateData(
      params,
      posts,
      this.commentRepository,
      { post: postId, parentComment: null },
    );
    return { data, meta };
  }

  public async getReplyOnComment(
    commentId:string ,
    params: QueryDto,
  ): Promise<{ data: Comment[]; meta: any }> {
    const posts = this.commentRepository
      .find({ parentComment: new Types.ObjectId(commentId) })
      .sort({ createdAt: -1 })
      .populate({ path: 'user', model: 'User',select: 'username profilePics _id', });
    const { data, meta } = await this.paginator.paginateData(
      params,
      posts,
      this.commentRepository,
      { parentComment: commentId },
    );
    return { data, meta };
  }
  public async commentOnPost(
    comment: CommentOnPostDto,
    user,
  ): Promise<GeneralResponse<Comment>> {
    const { post, ...rest } = comment;
    const findPost = await this.postRepository
      .findOne({ _id: new Types.ObjectId(post) })
      .populate({ path: 'user', model: 'User', select: 'username' });
    if (!findPost)
      throw new NotFoundException(
        "post doesn't exist, comment Was Not Sucessfully",
      );

    const createComment = await (
      await this.commentRepository.create({
        ...rest,
        post: new Types.ObjectId(post),
        user: user._id,
      })
    ).populate({ path: 'user', model: 'User' });
    await this.postRepository.updateOne(
      { _id: new Types.ObjectId(post) },
      { $inc: { numberOfComments: 1 } },
    );
    if (!findPost?.user?._id.equals(user?._id) || findPost === null) {
      // await this.notification.sendNotification({
      //   message: createComment,
      //   user: findPost?.user?._id,
      //   // commentter: JSON.stringify(findUser),
      //   commentter: user._id,
      //   type: 'CommentedOnPost',
      //   post: findPost._id,
      // });
    }
    this.postRepository.updateOne(
      { _id: new Types.ObjectId(post) },
      { updatedAt: new Date() },
    );
    return formatedResponse(
      'Post comment saved successfully',
      200,
      'success',
      createComment,
    );
  }

  public async likeAPost(
    postId: string,
    user: any,
  ): Promise<GeneralResponse<PostDocument>> {
    const likePost = await this.postRepository
      .findOneAndUpdate(
        { _id: new Types.ObjectId(postId), likes: { $nin: [user._id] } },
        { $addToSet: { likes: user._id }, $inc: { likesCount: 1 } },
        { new: true },
      )
      .populate({
        path: 'user',
        model: 'User',
        select: 'username avatar isOnline',
      });
    if (!likePost?.user?._id.equals(user?._id) || likePost === null) {
      // await this.notification.sendNotification({
      //   message: likePost,
      //   user: likePost?.user?._id,
      //   commentter: findUser._id,
      //   // commentter: JSON.stringify(findUser),
      //   type: 'LikedPost',
      //   post: likePost._id,
      // });
    }
    if (!likePost) throw new BadRequestException('Unable to Like A Post ');
    const post = await this.postRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(postId) },
      { updatedAt: new Date() },
      { new: true },
    );
    return formatedResponse('Post liked successfully', 200, 'success', post);
  }
  public async unlikeAPost(
    postId: string,
    user: any,
  ): Promise<GeneralResponse<PostDocument>> {
    const unlikePost: any = await this.postRepository
      .findOneAndUpdate(
        { _id: new Types.ObjectId(postId), likes: { $in: [user._id] } },
        { $pull: { likes: user._id }, $inc: { likesCount: -1 } },
        { new: true },
      )
      .populate({
        path: 'user',
        model: 'User',
        select: 'username profilePics _id',
      });
    if (!unlikePost) throw new NotFoundException('Unable to Unlike Post');

    return formatedResponse(
      'Post unliked successfully',
      200,
      'success',
      unlikePost,
    );
  }
  public async saveAPost(
    postId: string,
    userId: Types.ObjectId,
  ): Promise<GeneralResponse<User>> {
    const findPost: Post = await this.postRepository.findOne({
      _id: new Types.ObjectId(postId),
    });
    if (!findPost) throw new NotFoundException("Post doesn't exist");

    const savePost: User = await this.userRepository.findOneAndUpdate(
      { _id: userId, savedPosts: { $nin: [postId] } },
      {
        $addToSet: { savedPosts: new Types.ObjectId(postId) },
        $inc: { savedPostsCount: 1 },
      },
      { new: true },
    );
    if (!savePost) throw new ConflictException('Post has already been saved');

    return formatedResponse(
      'Post saved successfully',
      200,
      'success',
      savePost,
    );
  }

  public async unSaveAPost(
    postId: string,
    userId: Types.ObjectId,
  ): Promise<GeneralResponse<User>> {
    const findPost: Post = await this.postRepository.findOne({
      _id: new Types.ObjectId(postId),
    });
    if (!findPost) throw new NotFoundException("Post doesn't exist");

    const unSavePost: User = await this.userRepository.findOneAndUpdate(
      { _id: userId, savedPosts: { $in: [new Types.ObjectId(postId)] } },
      {
        $pull: { savedPosts: new Types.ObjectId(postId) },
        $inc: { savedPostsCount: -1 },
      },
      { new: true },
    );
    if (!unSavePost)
      throw new PreconditionFailedException(
        'Post does not exist in your saved posts',
      );

    return formatedResponse(
      'Post unsaved successfully',
      200,
      'success',
      unSavePost,
    );
  }

  public async likeAComment(
    commentId: string,
    user: any,
  ): Promise<GeneralResponse<Comment>> {
    console.log(user._id);
    const likeComment: Comment = await this.commentRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(commentId),
        // user: { ne: user._id },
        likes: { $nin: [user._id] },
      },
      { $addToSet: { likes: user._id }, $inc: { likesCount: 1 } },
      { new: true },
    );

    if (!likeComment?.user?._id.equals(user?._id) || likeComment === null) {
      // await this.notification.sendNotification({
      //   message: likeComment,
      //   user: likeComment?.user?._id,
      //   commentter: findUser._id,
      //   type: 'LikedComment',
      //   post: likeComment.post,
      // });
    }
    if (!likeComment) throw new BadRequestException('Unable to Like Comment');

    return formatedResponse(
      'Comment liked successfully',
      200,
      'success',
      likeComment,
    );
  }

  public async unlikeAComment(
    commentId: string,
    user: any,
  ): Promise<GeneralResponse<Comment>> {
    const likeComment: Comment = await this.commentRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(commentId), likes: { $in: [user._id] } },
      { $pull: { likes: user._id }, $inc: { likesCount: -1 } },
      { new: true },
    );
    if (!likeComment) throw new BadRequestException('Unable to UnLike Comment');

    return formatedResponse(
      'Comment unliked successfully',
      200,
      'success',
      likeComment,
    );
  }

  async replyAComment(data: ReplyACommentDto, user: any) {
    const { text, commentId } = data;
    const parentComment = await this.commentRepository
      .findOne({ _id: new Types.ObjectId(commentId) })
      .populate({
        path: 'user',
        model: 'User',
        select: 'username profilePics _id',
      });
    if (!parentComment) {
      throw new NotFoundException('comment not found');
    }

    const { post } = parentComment;
    const savedComment = await(
      await this.commentRepository.create({
        text,
        user: user._id,
        parentComment: new Types.ObjectId(commentId),
        post,
      })
    ).populate({ path: 'user', model: "User",select: 'username profilePics _id' });

    // Update the parent comment's replies array
    await this.commentRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(commentId) },
      {
        $push: { replies: savedComment._id },
        $inc: { replyCount: 1 },
      },
      { new: true },
    );
    if (
      !parentComment?.user?._id.equals(user?._id) ||
      parentComment === null
    ) {
      // await this.notification.sendNotification({
      //   message: savedComment,
      //   user: parentComment?.user?._id,
      //   commentter: findUser._id,
      //   type: 'CommentedOnPost',
      //   post: post,
      // });
    }

    return formatedResponse(
      'Reply saved successfully',
      200,
      'success',
      savedComment,
    );
  }

  public async likeAReply(
    replyId: string,
    user: any,
  ): Promise<GeneralResponse<Comment>> {
    const likeReply: Comment = await this.commentRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(replyId), likes: { $nin: [user._id] } },
      { $addToSet: { likes: user._id }, $inc: { likesCount: 1 } },
      { new: true },
    );
    if (!likeReply?.user?._id.equals(user?._id) || likeReply === null) {
      // await this.notification.sendNotification({
      //   message: likeReply,
      //   user: likeReply?.user?._id,
      //   commentter: findUser._id,
      //   type: 'LikedReply',
      //   post: likeReply.post,
      // });
    }

    if (!likeReply) throw new BadRequestException('Unable to Like Reply');

    return formatedResponse(
      'Reply liked successfully',
      200,
      'success',
      likeReply,
    );
  }
  public async unlikeAReply(
    replyId: string,
    user: any,
  ): Promise<GeneralResponse<Comment>> {
   
    const unlikeReply: Comment = await this.commentRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(replyId), likes: { $in: [user._id] } },
      { $pull: { likes: user._id }, $inc: { likesCount: -1 } },
      { new: true },
    );
    if (!unlikeReply) throw new BadRequestException('Unable to UnLike Reply');

    return formatedResponse(
      'Reply liked successfully',
      200,
      'success',
      unlikeReply,
    );
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
