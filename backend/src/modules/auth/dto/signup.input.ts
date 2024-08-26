import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  id: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

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
