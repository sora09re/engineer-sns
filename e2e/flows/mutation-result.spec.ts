import { expect, notification, test } from "../support/test";

test("プロフィールの編集で使われているユーザーネームにすると、API の理由が表示されて閉じない", async ({
	page,
	createUser,
	signIn,
}) => {
	const other = await createUser();
	const user = await createUser();
	await signIn(user);
	await page.goto(`/profile/${user.id}`);

	await page.getByRole("button", { name: "プロフィールを編集" }).click();
	const dialog = page.getByRole("dialog", { name: "プロフィールを編集" });
	await dialog.getByLabel("ユーザー名").fill(other.username);
	await dialog.getByRole("button", { name: "保存" }).click();

	await expect(notification(page, "このユーザーネームはすでに使われています。")).toBeVisible();
	await expect(dialog).toBeVisible();
});

test("新規ユーザー登録で使われているユーザーネームにすると、API の理由が表示されて登録のページに残る", async ({
	page,
	createUser,
	signIn,
}) => {
	const other = await createUser();
	const user = await createUser({ withProfile: false });
	await signIn(user);
	await page.goto("/auth/new-user");

	await page.getByLabel("名前").fill("新規 太郎");
	await page.getByLabel("ユーザーネーム").fill(other.username);
	await page.getByLabel("メールアドレス").fill(user.email);
	await page.getByRole("button", { name: "送信" }).click();

	await expect(notification(page, "このユーザーネームはすでに使われています。")).toBeVisible();
	await expect(page).toHaveURL(/\/auth\/new-user$/);
});
