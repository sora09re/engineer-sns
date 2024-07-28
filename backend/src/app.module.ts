import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [PrismaModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
