import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { SignupInput } from 'src/modules/auth/dto/signup.input';
import { LocalAuthGuard } from 'src/modules/auth/guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupInput: SignupInput) {
    const { email, password, name, username } = signupInput;
    return await this.authService.signup(email, password, name, username);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
}
