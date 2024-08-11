import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // タイムラインに表示する投稿一覧を取得
  async getTimelinePosts(currentUserId: string) {
    // フォローしているユーザーのIDを取得
    const follows = await this.prisma.follows.findMany({
      where: {
        followingId: currentUserId,
      },
      select: {
        followerId: true,
      },
    });

    const followerIds = follows.map((follow) => follow.followerId);

    const posts = await this.prisma.posts.findMany({
      where: {
        AND: [
          { parentPostId: null },
          { userId: { in: [...followerIds, currentUserId] } },
        ],
      },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return posts;
  }

  async createPost(postContent: string, userId: string) {
    const data = {
      content: postContent,
      isDeleted: false,
      parentPostId: null,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.prisma.posts.create({
      data,
    });
  }
}
