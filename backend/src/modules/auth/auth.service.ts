import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
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

  async validateGithubToken(token: string): Promise<any> {
    const url = 'https://api.github.com/user';

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Invalid GitHub token');
    }
  }
}
