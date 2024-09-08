import { useState } from "react";

import type { User } from "@/types/user";

interface UserProfile {
  id: string;
  bio?: string;
  location?: string;
  name: string;
  profileImageUrl?: string;
  username: string;
  website?: string;
}

export const useUserProfile = (currentUser: User) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: currentUser.id,
    bio: currentUser.bio,
    location: currentUser.location,
    name: currentUser.name,
    profileImageUrl: currentUser.profileImageUrl,
    username: currentUser.username,
    website: currentUser.website,
  });

  const updateUserProfile = (newUserProfile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      return { ...prev, ...newUserProfile };
    });
  };

  return { updateUserProfile, userProfile };
};
