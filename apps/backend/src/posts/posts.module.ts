import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CommentsController } from 'src/posts/comments/comments.controller';
import { CommentsService } from 'src/posts/comments/comments.service';
import { LikesController } from 'src/posts/likes/likes.controller';
import { LikesService } from 'src/posts/likes/likes.service';

@Module({
  controllers: [PostsController, CommentsController, LikesController],
  providers: [PostsService, CommentsService, LikesService],
})
export class PostsModule {}
