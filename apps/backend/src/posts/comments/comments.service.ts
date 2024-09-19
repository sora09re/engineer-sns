import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getCommentsByPostId(postId: string) {
    const comments = await this.prisma.posts.findMany({
      where: { parentPostId: postId },
      include: {
        user: true,
        likes: true,
        comments: {
          include: {
            user: true,
            likes: true,
            parentPost: {
              include: {
                user: true,
              },
            },
          },
        },
        parentPost: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (!comments) {
      throw new NotFoundException(
        `No comments found for post with ID ${postId}`,
      );
    }

    return comments;
  }

  async addComment(content: string, userId: string, postId: string) {
    const newComment = await this.prisma.posts.create({
      data: {
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        parentPostId: postId,
        userId: userId,
      },
    });

    return newComment;
  }
}
