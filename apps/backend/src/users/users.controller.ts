import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Users } from '@prisma/client';
import { GithubAuthGuard } from 'src/modules/auth/guards/github.guard';
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

  @Get(':userId/follow')
  async isFollowing(
    @Param('userId') userId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    const follow = await this.usersService.isFollowing(userId, currentUserId);
    return { isFollowing: !!follow };
  }

  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    return await this.usersService.getFollowers(userId);
  }

  @Get(':userId/followings')
  async getFollowings(@Param('userId') userId: string) {
    return await this.usersService.getFollowingUsers(userId);
  }

  @UseGuards(GithubAuthGuard)
  @Post(':userId/follow')
  async followUser(
    @Param('userId') userId: string,
    @Body('currentUserId') currentUserId: string,
  ) {
    return await this.usersService.followUser(userId, currentUserId);
  }

  @UseGuards(GithubAuthGuard)
  @Delete(':userId/follow')
  async unfollowUser(
    @Param('userId') userId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    return await this.usersService.unfollowUser(userId, currentUserId);
  }
}
