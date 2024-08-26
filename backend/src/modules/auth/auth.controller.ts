import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserCreateDto } from 'src/modules/auth/dto/signup.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() userCreateDto: UserCreateDto) {
    const {
      id,
      bio,
      email,
      location,
      name,
      profileImageUrl,
      username,
      website,
    } = userCreateDto;
    return await this.authService.signup(
      id,
      bio,
      email,
      location,
      name,
      profileImageUrl,
      username,
      website,
    );
  }
}
