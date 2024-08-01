import { Controller, Get, Query } from '@nestjs/common';
import { Users } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUser(@Query('userId') userId: string): Promise<Users | null> {
    return this.usersService.getUser(userId);
  }
}
