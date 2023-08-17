import type { Like } from "@/types/like";
import type { User } from "@/types/user";

export type PostType = {
  id: string;
  comments: PostType[];
  content: string;
  created_at: string;
  is_deleted: boolean;
  likes: Like[];
  parent_post_id: string;
  updated_at: string;
  user_id: string;
  users: User;
};

export type PostProps = {
  post: PostType;
};
