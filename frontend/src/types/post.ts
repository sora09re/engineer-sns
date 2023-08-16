import type { Dispatch, SetStateAction } from "react";

import type { Comment } from "@/types/comment";
import type { Like } from "@/types/like";
import type { User } from "@/types/user";

export type Post = {
  id: string;
  comments: Comment[];
  content: string;
  createdAt: Date;
  isDeleted: boolean;
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
  id: string;
  comments: Comment[];
  content: string;
  created_at: string;
  is_deleted: boolean;
  likes: Like[];
  updated_at: string;
  user_id: string;
  users: User;
};

export type PostDataProps = {
  post: PostData;
};
