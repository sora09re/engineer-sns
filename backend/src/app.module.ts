import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, SearchModule, UsersModule],
})
export class AppModule {}
