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
import { UsersService } from 'src/users/users.service';
import {
  currentUserIdSchema,
  getUserInputSchema,
  userIdSchema,
  validateWithSchema,
} from 'validation';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUser(@Query() userId: string): Promise<Users | null> {
    validateWithSchema(getUserInputSchema, userId);

    return await this.usersService.getUserByUserId(userId);
  }

  @Get(':userId/follow')
  async isFollowing(
    @Param('userId') userId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    validateWithSchema(userIdSchema, userId);
    validateWithSchema(currentUserIdSchema, currentUserId);

    const follow = await this.usersService.isFollowing(userId, currentUserId);
    return { isFollowing: !!follow };
  }

  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    validateWithSchema(userIdSchema, userId);

    return await this.usersService.getFollowers(userId);
  }

  @Get(':userId/followings')
  async getFollowings(@Param('userId') userId: string) {
    validateWithSchema(userIdSchema, userId);

    return await this.usersService.getFollowingUsers(userId);
  }

  @UseGuards(GithubAuthGuard)
  @Post(':userId/follow')
  async followUser(
    @Param('userId') userId: string,
    @Body('currentUserId') currentUserId: string,
  ) {
    validateWithSchema(userIdSchema, userId);
    validateWithSchema(currentUserIdSchema, currentUserId);

    return await this.usersService.followUser(userId, currentUserId);
  }

  @UseGuards(GithubAuthGuard)
  @Delete(':userId/follow')
  async unfollowUser(
    @Param('userId') userId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    validateWithSchema(userIdSchema, userId);
    validateWithSchema(currentUserIdSchema, currentUserId);

    return await this.usersService.unfollowUser(userId, currentUserId);
  }
}
