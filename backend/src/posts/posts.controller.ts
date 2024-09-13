import {
  BadRequestException,
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

  @Get(':postId/comments')
  async getComments(@Param('postId') postId: string) {
    return await this.postsService.getCommentsByPostId(postId);
  }

  @UseGuards(GithubAuthGuard)
  @Post()
  async createPost(@Body() createPostInput: CreatePostInput) {
    const { postContent, currentUserId } = createPostInput;
    await this.postsService.createPost(postContent, currentUserId);
  }

  @Post(':postId/comments')
  async addComment(
    @Param('postId') postId: string,
    @Body('commentContent') commentContent: string,
    @Body('currentUserId') currentUserId: string,
  ) {
    return await this.postsService.addComment(
      commentContent,
      currentUserId,
      postId,
    );
  }

  @Delete(':postId')
  async deletePost(@Param('postId') postId: string) {
    return await this.postsService.deletePost(postId);
  }

  @Get(':postId/likes')
  async findLike(
    @Param('postId') postId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    if (!postId || !currentUserId) {
      throw new BadRequestException();
    }

    return await this.postsService.findLikeByPostAndUser(postId, currentUserId);
  }

  @Post(':postId/likes')
  async createLike(
    @Param('postId') postId: string,
    @Body('currentUserId') currentUserId: string,
  ) {
    if (!postId || !currentUserId) {
      throw new BadRequestException();
    }

    return await this.postsService.createLike(postId, currentUserId);
  }

  @Delete(':postId/likes')
  async deleteLike(
    @Param('postId') postId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    if (!postId || !currentUserId) {
      throw new BadRequestException();
    }

    return await this.postsService.deleteLike(postId, currentUserId);
  }
}
