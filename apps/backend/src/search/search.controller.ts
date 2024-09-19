import { Controller, Get, Query } from '@nestjs/common';
import { Posts, Users } from '@prisma/client';
import { SearchService } from 'src/search/search.service';
import { SearchInput, searchInputSchema, validateWithSchema } from 'validation';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('users')
  async searchUsers(@Query() searchInput: SearchInput): Promise<Users[]> {
    validateWithSchema(searchInputSchema, searchInput);

    const { keyword } = searchInput;
    return await this.searchService.searchUsers(keyword);
  }

  @Get('posts')
  async searchPosts(@Query() searchInput: SearchInput): Promise<Posts[]> {
    validateWithSchema(searchInputSchema, searchInput);

    const { keyword } = searchInput;
    return await this.searchService.searchPosts(keyword);
  }
}
