/** フォロー: フォローする側（follower）がフォローされる側（followee）を購読する関係 */
export type Follow = {
	followerId: string;
	followeeId: string;
};

/** 自分自身はフォローできない */
export const canFollow = (follow: Follow) => {
	return follow.followerId !== follow.followeeId;
};
