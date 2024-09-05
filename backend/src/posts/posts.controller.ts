import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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

  @UseGuards(GithubAuthGuard)
  @Post()
  async createPost(@Body() createPostInput: CreatePostInput) {
    const { postContent, userId } = createPostInput;
    await this.postsService.createPost(postContent, userId);
  }
}
