import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(
    id: string,
    email: string,
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
        email,
        location,
        name,
        profileImageUrl,
        username,
        website,
      },
    });
  }
}
