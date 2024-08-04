import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserByUserId(userId: string): Promise<Users | null> {
    return await this.prisma.users.findUniqueOrThrow({
      where: { id: userId },
    });
  }
}
