import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserByUserId(userId: string): Promise<Users | null> {
    return await this.prisma.users.findUniqueOrThrow({
      where: { id: userId },
    });
  }

  async isFollowing(followerId: string, followingId: string) {
    return await this.prisma.follows.findFirst({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });
  }

  async getFollowers(userId: string): Promise<Users[]> {
    const follows = await this.prisma.follows.findMany({
      where: { followerId: userId },
      include: {
        following: true,
      },
    });

    return follows.map((follow) => follow.following);
  }

  async getFollowingUsers(userId: string): Promise<Users[]> {
    const follows = await this.prisma.follows.findMany({
      where: { followingId: userId },
      include: {
        follower: true,
      },
    });

    return follows.map((follow) => follow.follower);
  }

  async followUser(followerId: string, followingId: string) {
    return await this.prisma.follows.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  async unfollowUser(followerId: string, followingId: string) {
    return await this.prisma.follows.delete({
      where: {
        followerId_followingId: {
          followingId,
          followerId,
        },
      },
    });
  }
}
