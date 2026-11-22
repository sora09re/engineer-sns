import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { afterEach, describe, expect, it } from "vite-plus/test";

import {
	afterFollowChanged,
	afterLoginUserChanged,
	afterPostDeleted,
	afterPostsChanged,
	afterUserRegistered,
	queryKeys,
} from "./query-cache";

const unsubscribes: (() => void)[] = [];

afterEach(() => {
	unsubscribes.splice(0).forEach((unsubscribe) => unsubscribe());
});

const setup = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false, staleTime: Number.POSITIVE_INFINITY } },
	});
	const cached = async (queryKey: readonly unknown[], { active }: { active: boolean }) => {
		let fetchCount = 0;
		const queryFn = async () => {
			fetchCount += 1;
			return fetchCount;
		};
		await queryClient.fetchQuery({ queryKey, queryFn });
		if (active) {
			const observer = new QueryObserver(queryClient, { queryKey, queryFn });
			unsubscribes.push(observer.subscribe(() => {}));
		}
		return {
			refetched: () => fetchCount > 1,
			invalidated: () => queryClient.getQueryState(queryKey)?.isInvalidated ?? false,
		};
	};
	return { queryClient, cached };
};

describe("afterPostsChanged", () => {
	it("投稿のクエリを古くし、表示中のものを取り直す。ユーザーとフォローには触らない", async () => {
		const { queryClient, cached } = setup();
		const timeline = await cached(queryKeys.posts.timeline(), { active: true });
		const userPosts = await cached(queryKeys.posts.user("u1"), { active: false });
		const profile = await cached(queryKeys.users.profile("u1"), { active: true });
		const followers = await cached(queryKeys.follows.followers("u1"), { active: true });

		await afterPostsChanged(queryClient);

		expect(timeline.refetched()).toBe(true);
		expect(userPosts.refetched()).toBe(false);
		expect(userPosts.invalidated()).toBe(true);
		expect(profile.invalidated()).toBe(false);
		expect(followers.invalidated()).toBe(false);
	});
});

describe("afterPostDeleted", () => {
	it("投稿のクエリをすべて古くするが、消した投稿の詳細とコメントは取り直さない", async () => {
		const { queryClient, cached } = setup();
		const detail = await cached(queryKeys.posts.detail("p1"), { active: true });
		const comments = await cached(queryKeys.posts.comments("p1"), { active: true });
		const timeline = await cached(queryKeys.posts.timeline(), { active: true });
		const otherDetail = await cached(queryKeys.posts.detail("p2"), { active: true });

		await afterPostDeleted(queryClient, "p1");

		expect(detail.invalidated()).toBe(true);
		expect(detail.refetched()).toBe(false);
		expect(comments.invalidated()).toBe(true);
		expect(comments.refetched()).toBe(false);
		expect(timeline.refetched()).toBe(true);
		expect(otherDetail.refetched()).toBe(true);
	});

	it("消した投稿と同じ ID のユーザーの投稿一覧は取り直す", async () => {
		const { queryClient, cached } = setup();
		const userPosts = await cached(queryKeys.posts.user("p1"), { active: true });

		await afterPostDeleted(queryClient, "p1");

		expect(userPosts.refetched()).toBe(true);
	});
});

describe.each([
	["afterFollowChanged", afterFollowChanged],
	["afterLoginUserChanged", afterLoginUserChanged],
])("%s", (_name, after) => {
	it("フォロー・ユーザー・投稿のクエリを古くし、表示中のものを取り直す", async () => {
		const { queryClient, cached } = setup();
		const isFollowing = await cached(queryKeys.follows.isFollowing("u1"), { active: true });
		const profile = await cached(queryKeys.users.profile("u1"), { active: true });
		const timeline = await cached(queryKeys.posts.timeline(), { active: true });

		await after(queryClient);

		expect(isFollowing.refetched()).toBe(true);
		expect(profile.refetched()).toBe(true);
		expect(timeline.refetched()).toBe(true);
	});
});

describe("afterUserRegistered", () => {
	it("表示していないログイン中のユーザーのクエリも取り直す。投稿には触らない", async () => {
		const { queryClient, cached } = setup();
		const current = await cached(queryKeys.users.current(), { active: false });
		const timeline = await cached(queryKeys.posts.timeline(), { active: true });

		await afterUserRegistered(queryClient);

		expect(current.refetched()).toBe(true);
		expect(timeline.invalidated()).toBe(false);
	});
});
