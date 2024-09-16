import { IsString, IsNotEmpty } from 'class-validator';

export class SearchInput {
  @IsString()
  @IsNotEmpty({ message: 'Keyword is required' })
  keyword: string;
}
