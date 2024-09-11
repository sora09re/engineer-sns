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
import {
  CreatePostInput,
  GetTimelinePostsInput,
} from 'src/posts/dto/posts.input';
import { PostsService } from 'src/posts/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(GithubAuthGuard)
  @Get()
  async getTimelinePosts(
    @Query() getTimelinePostsInput: GetTimelinePostsInput,
  ) {
    const { currentUserId } = getTimelinePostsInput;
    return await this.postsService.getTimelinePosts(currentUserId);
  }

  @Get(':postId')
  async getPost(@Param('postId') postId: string) {
    return await this.postsService.getPostById(postId);
  }

  @UseGuards(GithubAuthGuard)
  @Post()
  async createPost(@Body() createPostInput: CreatePostInput) {
    const { postContent, currentUserId } = createPostInput;
    await this.postsService.createPost(postContent, currentUserId);
  }

  @Delete(':postId')
  async deletePost(@Param('postId') postId: string) {
    return await this.postsService.deletePost(postId);
  }
}
