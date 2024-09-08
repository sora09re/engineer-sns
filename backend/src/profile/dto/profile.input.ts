import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class ProfileUpdateDto {
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  id: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsOptional()
  @IsString()
  website?: string;
}
