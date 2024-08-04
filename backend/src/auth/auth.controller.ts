import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SignupInput } from 'src/auth/dto/signup.input';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupInput: SignupInput) {
    return await this.authService.signup(signupInput);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
}
