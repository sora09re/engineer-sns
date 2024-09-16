import { useState } from "react";

export interface NewUserValues {
  id: string;
  bio: string;
  email: string;
  location: string;
  name: string;
  profileImageUrl: string;
  username: string;
  website: string;
}

export const useNewUserProfile = (sessionUser: any) => {
  const [userProfile, setUserProfile] = useState<NewUserValues>({
    id: sessionUser?.id ?? "",
    bio: "",
    email: sessionUser?.email ?? "",
    location: "",
    name: "",
    profileImageUrl: sessionUser?.image ?? "",
    username: "",
    website: "",
  });

  const updateUserProfile = (newUserProfile: Partial<NewUserValues>) => {
    setUserProfile((prev) => {
      return { ...prev, ...newUserProfile };
    });
  };

  return { updateUserProfile, userProfile };
};
