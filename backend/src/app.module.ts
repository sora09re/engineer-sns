import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PostsModule } from 'src/posts/posts.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SearchModule,
    UsersModule,
    AuthModule,
    PostsModule,
    ProfileModule,
  ],
})
export class AppModule {}
