import { Injectable } from '@nestjs/common';
import { Posts, Users } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchUsers(keyword: string): Promise<Users[]> {
    return await this.prisma.users.findMany({
      where: {
        OR: [
          {
            name: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
          {
            bio: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async searchPosts(keyword: string): Promise<Posts[]> {
    return await this.prisma.posts.findMany({
      where: {
        AND: [
          { parentPostId: null },
          { content: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      include: {
        user: true,
        likes: true,
        comments: {
          where: { parentPostId: { not: null } },
        },
      },
    });
  }
}
