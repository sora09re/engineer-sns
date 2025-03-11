import { useState } from "react";

import type { User } from "@/types/user";

interface UserProfile {
	bio?: string;
	location?: string;
	name: string;
	profile_image_url?: string;
	username: string;
	website?: string;
}

export const useUserProfile = (currentUser: User) => {
	const [userProfile, setUserProfile] = useState<UserProfile>({
		bio: currentUser.bio,
		location: currentUser.location,
		name: currentUser.name,
		profile_image_url: currentUser.profile_image_url,
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
