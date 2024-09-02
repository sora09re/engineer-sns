import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { GetCurrentUserDto } from 'src/modules/auth/dto/getCurrentUser.input';
import { GithubLoginInput } from 'src/modules/auth/dto/githubLogin.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('github')
  async githubLogin(@Body() githubLoginInput: GithubLoginInput) {
    const { email, name, githubId } = githubLoginInput;
    return this.authService.validateGithubUser(email, name, githubId);
  }

  @Get('current')
  async getCurrentUserByEmail(@Query() getCurrentUserDto: GetCurrentUserDto) {
    const { email } = getCurrentUserDto;

    return await this.authService.getUserByEmail(email);
  }
}
