import type { Follow } from "@/types/follow";

export type ProfileType = {
  id: string;
  bio?: string;
  created_at: string;
  email: string;
  follower_user_id: Follow[];
  following_user_id: Follow[];
  location?: string;
  name: string;
  profile_image_url?: string;
  updated_at: string;
  username: string;
  website?: string;
};
