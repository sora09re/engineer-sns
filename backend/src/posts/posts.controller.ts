import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import {
  CreatePostInput,
  GetTimelinePostsInput,
} from 'src/posts/dto/posts.input';
import { PostsService } from 'src/posts/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTimelinePosts(
    @Query() getTimelinePostsInput: GetTimelinePostsInput,
  ) {
    const { currentUserId } = getTimelinePostsInput;
    return await this.postsService.getTimelinePosts(currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() createPostInput: CreatePostInput) {
    const { postContent, userId } = createPostInput;
    await this.postsService.createPost(postContent, userId);
  }
}
