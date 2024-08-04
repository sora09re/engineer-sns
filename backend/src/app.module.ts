import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SearchModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
