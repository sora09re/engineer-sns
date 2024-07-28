import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getCurrentUser(currentUserId: string): Promise<Users | null> {
    return this.prisma.users.findUniqueOrThrow({
      where: { id: currentUserId },
    });
  }
}
