import { queryOptions } from "@tanstack/react-query";

import { api, parse, queryKeys } from "@/shared/api";

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
