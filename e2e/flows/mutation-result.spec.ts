import { expect, notification, postCard, test } from "../support/test";

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
	await dialog.getByLabel("ユーザーネーム").fill(other.username);
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

test("投稿のモーダルを閉じて開き直したあとに前の投稿が済んでも、開き直したモーダルは閉じない", async ({
	page,
	createUser,
	signIn,
}) => {
	await signIn(await createUser());
	await page.goto("/");
	let release!: () => void;
	const released = new Promise<void>((resolve) => {
		release = resolve;
	});
	await page.route(
		(url) => {
			return url.pathname === "/api/posts";
		},
		async (route) => {
			if (route.request().method() === "POST") {
				await released;
			}
			await route.fallback();
		},
	);

	const open = page.getByRole("navigation").getByRole("button", { name: "投稿する" });
	const dialog = page.getByRole("dialog");
	await open.click();
	const content = `閉じる前の投稿 ${crypto.randomUUID().slice(0, 8)}`;
	await dialog.getByPlaceholder("今どうしてる？").fill(content);
	await dialog.getByRole("button", { name: "投稿する" }).click();
	await expect(notification(page, "投稿中...")).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();

	await open.click();
	await expect(dialog).toBeVisible();
	release();

	await expect(notification(page, "投稿に成功しました！")).toBeVisible();
	await expect(postCard(page, content)).toBeVisible();
	await page.waitForTimeout(500);
	await expect(dialog).toBeVisible();
});
