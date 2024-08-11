import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Posts, Users } from '@prisma/client';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { SearchInput } from 'src/search/dto/search.input';
import { SearchService } from 'src/search/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async searchUsers(
    @Query() searchInput: SearchInput,
  ): Promise<Omit<Users, 'password'>[]> {
    const { keyword } = searchInput;
    return await this.searchService.searchUsers(keyword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('posts')
  async searchPosts(@Query() searchInput: SearchInput): Promise<Posts[]> {
    const { keyword } = searchInput;
    return await this.searchService.searchPosts(keyword);
  }
}
