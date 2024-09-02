import { Body, Controller, Post } from '@nestjs/common';
import { ProfileUpdateDto } from 'src/profile/dto/profile.input';
import { ProfileService } from 'src/profile/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async updateProfile(@Body() profileUpdateDto: ProfileUpdateDto) {
    const {
      id,
      bio,
      email,
      location,
      name,
      profileImageUrl,
      username,
      website,
    } = profileUpdateDto;

    await this.profileService.updateProfile(
      id,
      email,
      name,
      profileImageUrl,
      username,
      location,
      bio,
      website,
    );
  }
}
