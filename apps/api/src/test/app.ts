import type { PostType } from "@engineer-sns/shared";

import { createApp } from "../app";
import type { Db } from "../infrastructure/db/client";
import { createTestKeys } from "./auth";

/**
 * テスト用の app。get / send でそのアカウントとしてリクエストする。
 * send は JSON の本文を送る（POST / DELETE など）
 */
export const setupApp = async (db: Db) => {
	const keys = await createTestKeys();
	const app = createApp({ db, jwks: keys.jwks });

	const get = async (path: string, accountId: string) => {
		const token = await keys.sign({ sub: accountId });
		return app.request(path, { headers: { Authorization: `Bearer ${token}` } });
	};

	const send = async (method: string, path: string, accountId: string, body?: unknown) => {
		const token = await keys.sign({ sub: accountId });
		return app.request(path, {
			method,
			headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	};

	return { app, get, send, ...keys };
};

/** レスポンスの投稿の本文だけを並び順どおりに取り出す */
export const contentsOf = async (res: Response) => {
	const posts = (await res.json()) as PostType[];
	return posts.map((post) => post.content);
};
