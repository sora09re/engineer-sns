import type { Dispatch, SetStateAction } from "react";

export type Post = {
  id: number;
  comments: number;
  content: string;
  likes: number;
  reposts: number;
};

export type PostProps = {
  post: Post;
};

export type PostsProps = {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
};
