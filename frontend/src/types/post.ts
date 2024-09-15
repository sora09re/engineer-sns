import type { Like } from "@/types/like";
import type { User } from "@/types/user";

export type PostType = {
  id: string;
  comments: PostType[];
  content: string;
  createdAt: Date;
  isDeleted: boolean;
  likes: Like[];
  parentPost?: PostType;
  parentPostId?: string | null;
  updatedAt: Date;
  user: User;
  userId: string;
};

export type PostProps = {
  post: PostType;
};
