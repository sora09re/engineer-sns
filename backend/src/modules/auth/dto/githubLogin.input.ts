import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class GithubLoginInput {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'GithubId is required' })
  githubId: string;
}
