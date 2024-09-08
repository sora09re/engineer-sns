import type { Follow } from "@/types/follow";
import type { PostType } from "@/types/post";

export type ProfileType = {
  id: string;
  bio?: string;
  createdAt: string;
  email: string;
  followers: Follow[];
  followings: Follow[];
  location?: string;
  name: string;
  posts: PostType[];
  profileImageUrl?: string;
  updated_at: string;
  username: string;
  website?: string;
};
