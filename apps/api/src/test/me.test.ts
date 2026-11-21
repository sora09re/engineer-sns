import type { User } from "@engineer-sns/shared";
import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";
import { createAccount, createUser } from "./fixtures";

describe("GET /api/me", () => {
	test("ログイン中のアカウントのユーザーを返す", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await get("/api/me", me.id);

			expect(res.status).toBe(200);
			expect((await res.json()) as User).toMatchObject({
				id: me.id,
				name: "me",
				username: "me",
				email: "me@example.com",
			});
		});
	});

	test("ユーザーのないアカウント（新規ユーザー登録の前）なら null", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);

			const res = await get("/api/me", crypto.randomUUID());

			expect(res.status).toBe(200);
			expect(await res.json()).toBeNull();
		});
	});
});

const newUser = {
	name: "新しい人",
	username: "new_user",
	email: "new@example.com",
	bio: "よろしく",
	location: "東京",
	website: "https://example.com",
	profile_image_url: "https://example.com/me.png",
};

describe("POST /api/me", () => {
	test("ログイン中のアカウントにユーザーを作って 201 で返す。その後 GET /api/me で取れる", async () => {
		await withRollback(async (db) => {
			const { get, send } = await setupApp(db);
			const accountId = await createAccount(db, "new@example.com");

			const res = await send("POST", "/api/me", accountId, newUser);

			expect(res.status).toBe(201);
			expect((await res.json()) as User).toMatchObject({ id: accountId, ...newUser });
			const me = await get("/api/me", accountId);
			expect((await me.json()) as User).toMatchObject({ id: accountId, ...newUser });
		});
	});

	test.each([
		["name", "名前を入力してください。"],
		["username", "ユーザーネームを入力してください。"],
		["email", "メールアドレスを入力してください。"],
	])("%s が空白だけなら 422", async (field, message) => {
		await withRollback(async (db) => {
			const { get, send } = await setupApp(db);
			const accountId = await createAccount(db, "new@example.com");

			const res = await send("POST", "/api/me", accountId, { ...newUser, [field]: "  " });

			expect(res.status).toBe(422);
			expect(await res.json()).toEqual({ message });
			expect(await (await get("/api/me", accountId)).json()).toBeNull();
		});
	});

	test.each([
		[160, 201],
		[161, 422],
	])("自己紹介は 160 文字まで（%i 文字なら %i）", async (length, status) => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const accountId = await createAccount(db, "new@example.com");

			const res = await send("POST", "/api/me", accountId, {
				...newUser,
				bio: "あ".repeat(length),
			});

			expect(res.status).toBe(status);
			if (status === 422) {
				expect(await res.json()).toEqual({ message: "自己紹介は160文字以内で入力してください。" });
			}
		});
	});

	test("ユーザーネームがほかのユーザーに使われていれば 409", async () => {
		await withRollback(async (db) => {
			const { get, send } = await setupApp(db);
			await createUser(db, "taken");
			const accountId = await createAccount(db, "new@example.com");

			const res = await send("POST", "/api/me", accountId, { ...newUser, username: "taken" });

			expect(res.status).toBe(409);
			expect(await res.json()).toEqual({ message: "このユーザーネームはすでに使われています。" });
			expect(await (await get("/api/me", accountId)).json()).toBeNull();
		});
	});

	test("新規ユーザー登録が済んだアカウントなら 409。ユーザーは変わらない", async () => {
		await withRollback(async (db) => {
			const { get, send } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await send("POST", "/api/me", me.id, newUser);

			expect(res.status).toBe(409);
			expect(await res.json()).toEqual({ message: "新規ユーザー登録は済んでいます。" });
			expect((await (await get("/api/me", me.id)).json()) as User).toMatchObject({
				username: "me",
			});
		});
	});
});

describe("PATCH /api/me", () => {
	test("送った項目だけを変えて 200 で返す", async () => {
		await withRollback(async (db) => {
			const { get, send } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await send("PATCH", "/api/me", me.id, { name: "新しい名前", bio: "" });

			expect(res.status).toBe(200);
			const expected = { id: me.id, name: "新しい名前", bio: "", username: "me" };
			expect((await res.json()) as User).toMatchObject(expected);
			expect((await (await get("/api/me", me.id)).json()) as User).toMatchObject(expected);
		});
	});

	test.each([
		["name", { name: " " }, "名前を入力してください。"],
		["username", { username: "" }, "ユーザーネームを入力してください。"],
		["email", { email: "" }, "メールアドレスを入力してください。"],
		["bio", { bio: "あ".repeat(161) }, "自己紹介は160文字以内で入力してください。"],
	])("%s がルールに合わなければ 422。ほかの項目も変えない", async (_, values, message) => {
		await withRollback(async (db) => {
			const { get, send } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await send("PATCH", "/api/me", me.id, { location: "大阪", ...values });

			expect(res.status).toBe(422);
			expect(await res.json()).toEqual({ message });
			expect((await (await get("/api/me", me.id)).json()) as User).not.toHaveProperty(
				"location",
				"大阪",
			);
		});
	});

	test("ユーザーネームがほかのユーザーに使われていれば 409", async () => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const me = await createUser(db, "me");
			await createUser(db, "taken");

			const res = await send("PATCH", "/api/me", me.id, { username: "taken" });

			expect(res.status).toBe(409);
			expect(await res.json()).toEqual({ message: "このユーザーネームはすでに使われています。" });
		});
	});

	test("自分がいま使っているユーザーネームはそのまま送ってよい", async () => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await send("PATCH", "/api/me", me.id, { username: "me", name: "名前" });

			expect(res.status).toBe(200);
		});
	});

	test("新規ユーザー登録の前なら 403", async () => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const accountId = await createAccount(db, "new@example.com");

			const res = await send("PATCH", "/api/me", accountId, { name: "名前" });

			expect(res.status).toBe(403);
			expect(await res.json()).toEqual({ message: "新規ユーザー登録が済んでいません。" });
		});
	});
});

describe.each(["POST", "PATCH"])("%s /api/me の本文の形", (method) => {
	test("JSON として読めなければ 400", async () => {
		await withRollback(async (db) => {
			const { app, sign } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await app.request("/api/me", {
				method,
				headers: {
					Authorization: `Bearer ${await sign({ sub: me.id })}`,
					"Content-Type": "application/json",
				},
				body: "{",
			});

			expect(res.status).toBe(400);
			expect(await res.json()).toEqual({ message: "リクエストの形式が正しくありません。" });
		});
	});

	test("項目の型が違えば 422", async () => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const accountId = await createAccount(db, "new@example.com");

			const res = await send(method, "/api/me", accountId, { ...newUser, bio: 1 });

			expect(res.status).toBe(422);
			expect(await res.json()).toEqual({ message: "入力の形式が正しくありません。" });
		});
	});
});
