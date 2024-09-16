import { IsString, IsNotEmpty } from 'class-validator';

export class GetUserInput {
  @IsString()
  @IsNotEmpty({ message: 'UserId is required' })
  userId: string;
}
