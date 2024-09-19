import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from 'src/modules/auth/guards/github.guard';
import { CommentsService } from 'src/posts/comments/comments.service';
import { validateWithSchema, addCommentSchema, postIdSchema } from 'validation';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(GithubAuthGuard)
  @Get()
  async getComments(@Param('postId') postId: string) {
    validateWithSchema(postIdSchema, postId);
    return await this.commentsService.getCommentsByPostId(postId);
  }

  @UseGuards(GithubAuthGuard)
  @Post()
  async addComment(
    @Param('postId') postId: string,
    @Body() addCommentInput: { commentContent: string; currentUserId: string },
  ) {
    validateWithSchema(postIdSchema, postId);
    validateWithSchema(addCommentSchema, addCommentInput);
    const { commentContent, currentUserId } = addCommentInput;
    return await this.commentsService.addComment(
      commentContent,
      currentUserId,
      postId,
    );
  }
}
