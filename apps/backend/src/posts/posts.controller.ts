import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GithubAuthGuard } from 'src/modules/auth/guards/github.guard';

import { PostsService } from 'src/posts/posts.service';
import {
  validateWithSchema,
  currentUserIdSchema,
  postIdSchema,
  addCommentSchema,
  createPostInputSchema,
  CreatePostInput,
  getTimelinePostsInputSchema,
  GetTimelinePostsInput,
} from 'validation';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(GithubAuthGuard)
  @Get()
  async getTimelinePosts(
    @Query() getTimelinePostsInput: GetTimelinePostsInput,
  ) {
    validateWithSchema(getTimelinePostsInputSchema, getTimelinePostsInput);

    const { currentUserId } = getTimelinePostsInput;
    return await this.postsService.getTimelinePosts(currentUserId);
  }

  @UseGuards(GithubAuthGuard)
  @Get(':postId')
  async getPost(@Param('postId') postId: string) {
    validateWithSchema(postIdSchema, postId);

    return await this.postsService.getPostById(postId);
  }

  @UseGuards(GithubAuthGuard)
  @Get(':postId/comments')
  async getComments(@Param('postId') postId: string) {
    validateWithSchema(postIdSchema, postId);

    return await this.postsService.getCommentsByPostId(postId);
  }

  @UseGuards(GithubAuthGuard)
  @Post()
  async createPost(@Body() createPostInput: CreatePostInput) {
    validateWithSchema(createPostInputSchema, createPostInput);

    const { postContent, currentUserId } = createPostInput;
    await this.postsService.createPost(postContent, currentUserId);
  }

  @UseGuards(GithubAuthGuard)
  @Post(':postId/comments')
  async addComment(
    @Param('postId') postId: string,
    @Body() addCommentInput: { commentContent: string; currentUserId: string },
  ) {
    validateWithSchema(postIdSchema, postId);
    validateWithSchema(addCommentSchema, addCommentInput);

    const { commentContent, currentUserId } = addCommentInput;

    return await this.postsService.addComment(
      commentContent,
      currentUserId,
      postId,
    );
  }

  @UseGuards(GithubAuthGuard)
  @Delete(':postId')
  async deletePost(@Param('postId') postId: string) {
    validateWithSchema(postIdSchema, postId);

    return await this.postsService.deletePost(postId);
  }

  @UseGuards(GithubAuthGuard)
  @Get(':postId/likes')
  async findLike(
    @Param('postId') postId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    validateWithSchema(postIdSchema, postId);
    validateWithSchema(currentUserIdSchema, currentUserId);

    return await this.postsService.findLikeByPostAndUser(postId, currentUserId);
  }

  @UseGuards(GithubAuthGuard)
  @Post(':postId/likes')
  async createLike(
    @Param('postId') postId: string,
    @Body('currentUserId') currentUserId: string,
  ) {
    validateWithSchema(postIdSchema, postId);
    validateWithSchema(currentUserIdSchema, currentUserId);

    return await this.postsService.createLike(postId, currentUserId);
  }

  @UseGuards(GithubAuthGuard)
  @Delete(':postId/likes')
  async deleteLike(
    @Param('postId') postId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    validateWithSchema(postIdSchema, postId);
    validateWithSchema(currentUserIdSchema, currentUserId);

    return await this.postsService.deleteLike(postId, currentUserId);
  }
}
