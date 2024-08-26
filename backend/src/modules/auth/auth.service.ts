import { ConflictException, Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    id: string,
    bio: string,
    email: string,
    location: string,
    name: string,
    profileImageUrl: string,
    username: string,
    website: string,
  ): Promise<Users> {
    // 既にメールアドレスが使用されていないかチェック
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    return await this.prisma.users.create({
      data: {
        id,
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
