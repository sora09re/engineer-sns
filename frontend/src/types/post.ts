import type { Dispatch, SetStateAction } from "react";

import type { Comment } from "@/types/comment";

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
