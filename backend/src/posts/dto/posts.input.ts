import { IsNotEmpty, IsString } from 'class-validator';

export class GetTimelinePostsInput {
  @IsString()
  @IsNotEmpty({ message: 'CrrentUserId is required' })
  currentUserId: string;
}

export class CreatePostInput {
  @IsString()
  @IsNotEmpty({ message: 'PostContent is required' })
  postContent: string;

  @IsString()
  @IsNotEmpty({ message: 'UserId is required' })
  userId: string;
}
