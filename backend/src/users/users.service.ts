import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: string): Promise<Users | null> {
    return await this.prisma.users.findUniqueOrThrow({
      where: { id: userId },
    });
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return await this.prisma.users.findUnique({
      where: { email },
    });
  }

  async createUser(data: any): Promise<Users | null> {
    return await this.prisma.users.create({
      data,
    });
  }
}
