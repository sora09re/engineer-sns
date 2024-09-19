import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async findLikeByPostAndUser(postId: string, userId: string) {
    const like = await this.prisma.likes.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    return like;
  }

  async createLike(postId: string, userId: string) {
    const like = await this.prisma.likes.create({
      data: {
        postId,
        userId,
      },
    });

    return like;
  }

  async deleteLike(postId: string, userId: string) {
    const like = await this.prisma.likes.deleteMany({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    return like;
  }
}
