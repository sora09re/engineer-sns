import type { PostType } from "@engineer-sns/shared";

import { createApp } from "../app";
import type { Db } from "../infrastructure/db/client";
import { createTestKeys } from "./auth";

/** テスト用の app。get(path, accountId) でそのアカウントとしてリクエストする */
export const setupApp = async (db: Db) => {
	const keys = await createTestKeys();
	const app = createApp({ db, jwks: keys.jwks });

	const get = async (path: string, accountId: string) => {
		const token = await keys.sign({ sub: accountId });
		return app.request(path, { headers: { Authorization: `Bearer ${token}` } });
	};

	return { app, get, ...keys };
};

/** レスポンスの投稿の本文だけを並び順どおりに取り出す */
export const contentsOf = async (res: Response) => {
	const posts = (await res.json()) as PostType[];
	return posts.map((post) => post.content);
};
