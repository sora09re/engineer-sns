import type { Dispatch, SetStateAction } from "react";

import type { Comment } from "@/types/comment";
import type { Like } from "@/types/like";
import type { User } from "@/types/user";

export type Post = {
  id: number;
  comments: Comment[];
  content: string;
  createdAt: Date;
  isDeleted: boolean;
  likesCount: number;
  updatedAt: Date;
  userId: number;
};

export type PostProps = {
  post: Post;
};

export type PostsProps = {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
};

export type PostData = {
  id: number;
  comments: Comment[];
  content: string;
  created_at: string;
  is_deleted: boolean;
  likes: Like;
  updated_at: string;
  user_id: number;
  users: User;
};

export type PostDataProps = {
  post: PostData;
};
