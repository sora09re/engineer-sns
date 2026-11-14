import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";
import { createAccount } from "./fixtures";
import { deleteUploadedImages } from "./storage";

const MAX_SIZE = 3 * 1024 * 1024;

type UploadTarget = { upload_url: string; public_url: string };

/** 小さな PNG（1x1） */
const png = Uint8Array.from(
	atob(
		"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
	),
	(char) => char.charCodeAt(0),
);

describe("POST /api/me/profile-image", () => {
	test("許可された画像形式なら 201。upload_url にアップロードすると public_url から取れる", async () => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const accountId = await createAccount(db, "new@example.com");

			const res = await send("POST", "/api/me/profile-image", accountId, {
				content_type: "image/png",
				size: png.byteLength,
			});

			expect(res.status).toBe(201);
			const target = (await res.json()) as UploadTarget;
			try {
				const upload = await fetch(target.upload_url, {
					method: "PUT",
					headers: { "Content-Type": "image/png" },
					body: png,
				});
				expect(upload.ok).toBe(true);
				const image = await fetch(target.public_url);
				expect(image.status).toBe(200);
				expect(new Uint8Array(await image.arrayBuffer())).toEqual(png);
			} finally {
				await deleteUploadedImages([target.public_url]);
			}
		});
	});

	test("保存先は自分のアカウント ID のフォルダの下で、毎回違う", async () => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const accountId = await createAccount(db, "new@example.com");
			const body = { content_type: "image/webp", size: 100 };

			const first = (await (
				await send("POST", "/api/me/profile-image", accountId, body)
			).json()) as UploadTarget;
			const second = (await (
				await send("POST", "/api/me/profile-image", accountId, body)
			).json()) as UploadTarget;

			const folder = `/profile_image/${accountId}/`;
			expect(first.public_url).toContain(folder);
			expect(first.public_url).toMatch(/\.webp$/);
			expect(first.upload_url).toContain(folder);
			expect(second.public_url).not.toBe(first.public_url);
		});
	});

	test.each(["image/svg+xml", "text/plain"])("%s は 422", async (contentType) => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const accountId = await createAccount(db, "new@example.com");

			const res = await send("POST", "/api/me/profile-image", accountId, {
				content_type: contentType,
				size: 100,
			});

			expect(res.status).toBe(422);
			expect(await res.json()).toEqual({ message: "対応していない画像形式です。" });
		});
	});

	test.each([
		[MAX_SIZE, 201],
		[MAX_SIZE + 1, 422],
	])("サイズは 3MB まで（%i バイトなら %i）", async (size, status) => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const accountId = await createAccount(db, "new@example.com");

			const res = await send("POST", "/api/me/profile-image", accountId, {
				content_type: "image/jpeg",
				size,
			});

			expect(res.status).toBe(status);
			if (status === 422) {
				expect(await res.json()).toEqual({ message: "画像は3MBまでです。" });
			}
		});
	});

	test("JSON として読めなければ 400", async () => {
		await withRollback(async (db) => {
			const { app, sign } = await setupApp(db);
			const accountId = await createAccount(db, "new@example.com");

			const res = await app.request("/api/me/profile-image", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${await sign({ sub: accountId })}`,
					"Content-Type": "application/json",
				},
				body: "{",
			});

			expect(res.status).toBe(400);
		});
	});

	test.each([{ content_type: "image/png" }, { content_type: "image/png", size: "100" }])(
		"項目が足りないか型が違えば 422（%j）",
		async (body) => {
			await withRollback(async (db) => {
				const { send } = await setupApp(db);
				const accountId = await createAccount(db, "new@example.com");

				const res = await send("POST", "/api/me/profile-image", accountId, body);

				expect(res.status).toBe(422);
				expect(await res.json()).toEqual({ message: "入力の形式が正しくありません。" });
			});
		},
	);
});
