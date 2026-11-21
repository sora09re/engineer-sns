export type Follow = {
	followerId: string;
	followeeId: string;
};

export const canFollow = (follow: Follow) => {
	return follow.followerId !== follow.followeeId;
};
