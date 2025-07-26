import type { Session } from "next-auth";
import { useState } from "react";

export interface NewUserValues {
	id: string;
	bio: string;
	email: string;
	location: string;
	name: string;
	profile_image_url: string;
	username: string;
	website: string;
}

export const useNewUserProfile = (sessionUser: Session["user"]) => {
	const [userProfile, setUserProfile] = useState<NewUserValues>({
		id: sessionUser?.id ?? "",
		bio: "",
		email: sessionUser?.email ?? "",
		location: "",
		name: "",
		profile_image_url: sessionUser?.image ?? "",
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
