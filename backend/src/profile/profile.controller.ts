import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from 'src/modules/auth/guards/github.guard';
import { ProfileUpdateDto } from 'src/profile/dto/profile.input';
import { ProfileService } from 'src/profile/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(GithubAuthGuard)
  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    return await this.profileService.getProfileWithFollowersAndFollowing(
      userId,
    );
  }

  @UseGuards(GithubAuthGuard)
  @Post()
  async updateProfile(@Body() profileUpdateDto: ProfileUpdateDto) {
    const { id, bio, location, name, profileImageUrl, username, website } =
      profileUpdateDto;

    return await this.profileService.updateProfile(
      id,
      name,
      profileImageUrl,
      username,
      location,
      bio,
      website,
    );
  }

  @UseGuards(GithubAuthGuard)
  @Get('posts/:userId')
  async getPosts(@Param('userId') userId: string) {
    return await this.profileService.getPostsByUserId(userId);
  }
}
