import type { PostType } from "@engineer-sns/shared";

import { createApp } from "../app";
import type { Db } from "../infrastructure/db/client";
import { createTestKeys } from "./auth";
import { storageConfig } from "./storage";

export const setupApp = async (db: Db) => {
	const keys = await createTestKeys();
	const app = createApp({ db, jwks: keys.jwks, storage: storageConfig });

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

export const contentsOf = async (res: Response) => {
	const posts = (await res.json()) as PostType[];
	return posts.map((post) => post.content);
};

export const uniqueWord = () => {
	return `kw${crypto.randomUUID().replaceAll("-", "").replace(/[0-9]/g, "")}`;
};
