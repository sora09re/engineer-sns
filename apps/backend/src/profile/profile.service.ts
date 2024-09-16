import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfileWithFollowersAndFollowing(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        followers: {
          include: {
            follower: true,
          },
        },
        followings: {
          include: {
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateProfile(
    id: string,
    name: string,
    profileImageUrl: string,
    username: string,
    location?: string,
    bio?: string,
    website?: string,
  ): Promise<Users> {
    return await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        bio,
        location,
        name,
        profileImageUrl,
        username,
        website,
      },
    });
  }

  async getPostsByUserId(userId: string) {
    const posts = await this.prisma.posts.findMany({
      where: { userId },
      include: {
        user: true,
        likes: true,
        comments: true,
        parentPost: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  }
}
