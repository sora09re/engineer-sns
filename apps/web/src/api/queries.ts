import { queryOptions } from "@tanstack/react-query";

import { api, parse, queryKeys } from "@/shared/api";

/** features/toggle-follow に移すまでの置き場所 */
/** ログイン中のユーザーが userId をフォローしているか */
export const isFollowingQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.follows, "isFollowing", userId],
		queryFn: async (): Promise<boolean> => {
			const { following } = await parse(
				await api.api.users[":userId"].follow.$get({ param: { userId } }),
			);
			return following;
		},
	});
};
