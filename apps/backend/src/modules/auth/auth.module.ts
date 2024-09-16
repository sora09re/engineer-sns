import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GithubAuthGuard } from 'src/modules/auth/guards/github.guard';
import { GithubStrategy } from 'src/modules/auth/strategies/github.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'github' }),
  ],
  providers: [AuthService, GithubAuthGuard, GithubStrategy],
  controllers: [AuthController],
  exports: [AuthService, GithubAuthGuard],
})
export class AuthModule {}
