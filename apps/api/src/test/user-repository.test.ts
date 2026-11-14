/**
 * ユーザーネームの確認（assertUsernameAvailable）と書き込みの間に、ほかの登録が割り込んだときの備え。
 * HTTP 経由では同時実行を再現しにくいので、ここだけ repository を直接テストする。
 */
import { describe, expect, test } from "vite-plus/test";

import { ConflictError } from "../application/errors";
import { createUserRepository } from "../infrastructure/repositories/user-repository";
import { withRollback } from "./db";
import { createAccount, createUser } from "./fixtures";

const message = "このユーザーネームはすでに使われています。";

describe("UserRepository のユーザーネームの一意制約", () => {
	test("create でユーザーネームが重なれば ConflictError", async () => {
		await withRollback(async (db) => {
			await createUser(db, "taken");
			const accountId = await createAccount(db, "new@example.com");

			const result = createUserRepository(db).create({
				id: accountId,
				name: "新しい人",
				username: "taken",
				email: "new@example.com",
			});

			await expect(result).rejects.toThrow(new ConflictError(message));
		});
	});

	test("update でユーザーネームが重なれば ConflictError", async () => {
		await withRollback(async (db) => {
			await createUser(db, "taken");
			const me = await createUser(db, "me");

			const result = createUserRepository(db).update(me.id, { username: "taken" });

			await expect(result).rejects.toThrow(new ConflictError(message));
		});
	});
});
