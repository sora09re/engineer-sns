import { Controller, Get, Query } from '@nestjs/common';
import { Users } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('current')
  async getCurrentUser(
    @Query('currentUserId') currentUserId: string,
  ): Promise<Users | null> {
    return this.usersService.getCurrentUser(currentUserId);
  }
}
