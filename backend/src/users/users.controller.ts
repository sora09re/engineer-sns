import { Controller, Get, Query } from '@nestjs/common';
import { Users } from '@prisma/client';
import { GetUserInput } from 'src/users/dto/users.input';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUser(@Query() getUserInput: GetUserInput): Promise<Users | null> {
    const { userId } = getUserInput;
    return await this.usersService.getUserByUserId(userId);
  }
}
