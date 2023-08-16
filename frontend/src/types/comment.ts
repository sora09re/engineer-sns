import type { Like } from "@/types/like";
import type { User } from "@/types/user";

export type Comment = {
  id: number;
  comments: Comment[];
  content: string;
  created_at: string;
  is_deleted: boolean;
  post_id: string;
  updated_at: string;
  user_id: string;
};

export type CommentProps = {
  comment: Comment;
};

export type CommentData = {
  id: string;
  comments: Comment[];
  content: string;
  created_at: string;
  is_deleted: boolean;
  likes: Like[];
  post_id: string;
  updated_at: string;
  user_id: string;
  users: User;
};
