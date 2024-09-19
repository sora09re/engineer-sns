import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GithubAuthGuard } from 'src/modules/auth/guards/github.guard';
import { LikesService } from 'src/posts/likes/likes.service';
import {
  validateWithSchema,
  postIdSchema,
  currentUserIdSchema,
} from 'validation';

@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(GithubAuthGuard)
  @Get()
  async findLike(
    @Param('postId') postId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    validateWithSchema(postIdSchema, postId);
    validateWithSchema(currentUserIdSchema, currentUserId);
    return await this.likesService.findLikeByPostAndUser(postId, currentUserId);
  }

  @UseGuards(GithubAuthGuard)
  @Post()
  async createLike(
    @Param('postId') postId: string,
    @Body('currentUserId') currentUserId: string,
  ) {
    validateWithSchema(postIdSchema, postId);
    validateWithSchema(currentUserIdSchema, currentUserId);
    return await this.likesService.createLike(postId, currentUserId);
  }

  @UseGuards(GithubAuthGuard)
  @Delete()
  async deleteLike(
    @Param('postId') postId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    validateWithSchema(postIdSchema, postId);
    validateWithSchema(currentUserIdSchema, currentUserId);
    return await this.likesService.deleteLike(postId, currentUserId);
  }
}
