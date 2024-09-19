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
  postIdSchema,
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
  @Post()
  async createPost(@Body() createPostInput: CreatePostInput) {
    validateWithSchema(createPostInputSchema, createPostInput);

    const { postContent, currentUserId } = createPostInput;
    await this.postsService.createPost(postContent, currentUserId);
  }

  @UseGuards(GithubAuthGuard)
  @Get(':postId')
  async getPost(@Param('postId') postId: string) {
    validateWithSchema(postIdSchema, postId);

    return await this.postsService.getPostById(postId);
  }

  @UseGuards(GithubAuthGuard)
  @Delete(':postId')
  async deletePost(@Param('postId') postId: string) {
    validateWithSchema(postIdSchema, postId);

    return await this.postsService.deletePost(postId);
  }
}
