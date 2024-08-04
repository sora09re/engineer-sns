import { Controller, Get, Query } from '@nestjs/common';
import { Posts, Users } from '@prisma/client';
import { SearchService } from 'src/search/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('users')
  async searchUsers(@Query('keyword') keyword: string): Promise<Users[]> {
    return await this.searchService.searchUsers(keyword);
  }

  @Get('posts')
  async searchPosts(@Query('keyword') keyword: string): Promise<Posts[]> {
    return await this.searchService.searchPosts(keyword);
  }
}
