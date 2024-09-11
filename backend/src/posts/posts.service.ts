import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getPostById(postId: string) {
    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
      include: {
        user: true,
        comments: true,
        likes: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return post;
  }

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

  async createPost(postContent: string, currentUserId: string) {
    const data = {
      content: postContent,
      isDeleted: false,
      parentPostId: null,
      userId: currentUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.prisma.posts.create({
      data,
    });
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

  async deletePost(postId: string) {
    const post = await this.prisma.posts.delete({
      where: { id: postId },
    });

    return post;
  }
}
