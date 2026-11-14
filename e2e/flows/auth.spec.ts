import { expect, test } from "../support/test";

test("未ログインならログインページに送られる", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveURL(/\/auth\/signin$/);
	await expect(page).toHaveTitle("ログイン | Engineer-SNS");
	await expect(page.getByRole("button", { name: "Githubでログイン" })).toBeVisible();
});

test("ユーザーのないアカウントは新規ユーザー登録をしてからホームに進む", async ({
	page,
	createUser,
	signIn,
}) => {
	const user = await createUser({ withProfile: false });
	await signIn(user);

	await page.goto("/");
	await expect(page).toHaveURL(/\/auth\/new-user$/);
	await expect(page).toHaveTitle("ユーザー新規登録 | Engineer-SNS");

	await page.getByLabel("名前").fill("新規 太郎");
	await page.getByLabel("ユーザーネーム").fill(user.username);
	await page.getByLabel("メールアドレス").fill(user.email);
	await page.getByLabel("自己紹介").fill("はじめまして");
	await page.getByRole("button", { name: "送信" }).click();

	await expect(page).toHaveURL(/\/$/);
	await expect(page).toHaveTitle("ホーム | Engineer-SNS");
	await expect(page.getByRole("navigation").getByText("新規 太郎")).toBeVisible();
	await expect(page.getByRole("navigation").getByText(`@${user.username}`)).toBeVisible();
});

test("ログアウトするとログインページに戻り、ログインが必要なページに入れなくなる", async ({
	page,
	createUser,
	signIn,
}) => {
	const user = await createUser();
	await signIn(user);
	await page.goto("/");
	await expect(page).toHaveTitle("ホーム | Engineer-SNS");

	await page.getByRole("button", { name: "ログアウト" }).click();
	await expect(page).toHaveURL(/\/auth\/signin$/);

	await page.goto("/search");
	await expect(page).toHaveURL(/\/auth\/signin$/);
});
