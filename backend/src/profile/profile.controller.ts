import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfileUpdateDto } from 'src/profile/dto/profile.input';
import { ProfileService } from 'src/profile/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    return await this.profileService.getProfileWithFollowersAndFollowing(
      userId,
    );
  }

  @Post()
  async updateProfile(@Body() profileUpdateDto: ProfileUpdateDto) {
    const { id, bio, location, name, profileImageUrl, username, website } =
      profileUpdateDto;

    await this.profileService.updateProfile(
      id,
      name,
      profileImageUrl,
      username,
      location,
      bio,
      website,
    );
  }

  @Get('posts/:userId')
  async getPosts(@Param('userId') userId: string) {
    return await this.profileService.getPostsByUserId(userId);
  }
}
