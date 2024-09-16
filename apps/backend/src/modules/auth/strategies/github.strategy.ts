import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const token = this.extractTokenFromRequest(req);

    if (!token) {
      throw new UnauthorizedException('No GitHub token provided');
    }

    // GitHubアクセストークンを検証
    const user = await this.authService.validateGithubToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid GitHub token');
    }

    return user;
  }

  private extractTokenFromRequest(req: any): string | null {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return null;
    }

    const [, token] = authHeader.split(' ');
    return token;
  }
}
