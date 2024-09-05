import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Posts, Users } from '@prisma/client';
import { GithubAuthGuard } from 'src/modules/auth/guards/github.guard';
import { SearchInput } from 'src/search/dto/search.input';
import { SearchService } from 'src/search/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(GithubAuthGuard)
  @Get('users')
  async searchUsers(@Query() searchInput: SearchInput): Promise<Users[]> {
    const { keyword } = searchInput;
    return await this.searchService.searchUsers(keyword);
  }

  @UseGuards(GithubAuthGuard)
  @Get('posts')
  async searchPosts(@Query() searchInput: SearchInput): Promise<Posts[]> {
    const { keyword } = searchInput;
    return await this.searchService.searchPosts(keyword);
  }
}
