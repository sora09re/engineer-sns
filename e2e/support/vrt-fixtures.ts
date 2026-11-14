/**
 * VRT 用の固定データ。ID も日時も固定し、毎回同じ画面になるようにする。
 * ほかのデータ（シードや E2E が作ったもの）が混ざらないよう、
 * 2 人のユーザーは互いだけをフォローし、検索には VRT_KEYWORD を使う。
 */
import { createAccount, insertRows } from "./supabase";

export const VRT_KEYWORD = "zxqvrt";

export const ALICE = {
	id: "a11ce000-0000-4000-8000-000000000001",
	email: "vrt-alice@example.com",
	name: "Alice VRT",
	username: "vrt_alice",
	bio: "VRT 用のユーザーです。フロントエンドが好き。",
	location: "Tokyo",
	website: "https://example.com/alice",
};

export const BOB = {
	id: "b0b00000-0000-4000-8000-000000000002",
	email: "vrt-bob@example.com",
	name: "Bob VRT",
	username: "vrt_bob",
	bio: "VRT 用のもう 1 人のユーザーです。",
	location: "Osaka",
	website: "https://example.com/bob",
};

/** ユーザー（プロフィール）をまだ作っていないアカウント。新規ユーザー登録の画面に使う */
export const NEWBIE = {
	id: "0e1b1e00-0000-4000-8000-000000000003",
	email: "vrt-newbie@example.com",
};

export const POSTS = {
	bobFirst: "b0b00000-0000-4000-8000-0000000000a1",
	bobCode: "b0b00000-0000-4000-8000-0000000000a2",
	aliceFirst: "a11ce000-0000-4000-8000-0000000000a3",
	aliceComment: "a11ce000-0000-4000-8000-0000000000a4",
};

/** VRT のアカウントのパスワード。global setup で決めて、環境変数でテストに渡す */
export const VRT_PASSWORDS_ENV = "E2E_VRT_PASSWORDS";

export const createVrtFixtures = async () => {
	const alice = await createAccount(ALICE.email, ALICE.id);
	await createAccount(BOB.email, BOB.id);
	const newbie = await createAccount(NEWBIE.email, NEWBIE.id);

	const { id: _a, ...aliceProfile } = ALICE;
	const { id: _b, ...bobProfile } = BOB;
	await insertRows("users", [
		{ id: ALICE.id, ...aliceProfile },
		{ id: BOB.id, ...bobProfile },
	]);
	await insertRows("follows", [
		{ follower_id: ALICE.id, followee_id: BOB.id },
		{ follower_id: BOB.id, followee_id: ALICE.id },
	]);
	await insertRows("posts", [
		{
			id: POSTS.bobFirst,
			user_id: BOB.id,
			content: `${VRT_KEYWORD} はじめての投稿です。よろしくお願いします。`,
			created_at: "2026-01-02T03:04:00Z",
		},
		{
			id: POSTS.bobCode,
			user_id: BOB.id,
			content: `${VRT_KEYWORD} TypeScript のコードです。\n\`\`\`ts\nconst answer: number = 42;\nconsole.log(answer);\n\`\`\``,
			created_at: "2026-01-03T04:05:00Z",
		},
		{
			id: POSTS.aliceFirst,
			user_id: ALICE.id,
			content: `${VRT_KEYWORD} Alice の投稿です。`,
			created_at: "2026-01-04T05:06:00Z",
		},
	]);
	await insertRows("posts", [
		{
			id: POSTS.aliceComment,
			user_id: ALICE.id,
			parent_post_id: POSTS.bobFirst,
			content: "よろしくお願いします！",
			created_at: "2026-01-05T06:07:00Z",
		},
	]);
	await insertRows("likes", [{ post_id: POSTS.bobFirst, user_id: ALICE.id }]);

	return { alice, newbie };
};
