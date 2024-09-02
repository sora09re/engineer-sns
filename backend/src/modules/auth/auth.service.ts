import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateGithubUser(email: string, name: string, githubId: string) {
    let user = await this.prisma.users.findUnique({
      where: { githubId: githubId },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          email: email,
          name: name,
          githubId: githubId,
        },
      });
    }

    return user;
  }

  async getUserByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: { email: email },
    });
  }
}
