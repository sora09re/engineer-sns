import { expect, notification, postCard, test } from "../support/test";

test.beforeEach(async ({ page, createUser, signIn }) => {
	await signIn(await createUser());
	await page.goto("/");
	await expect(page).toHaveTitle("ホーム | Engineer-SNS");
});

const uniqueText = (label: string) => {
	return `${label} ${crypto.randomUUID().slice(0, 8)}`;
};

test("ホームのフォームから投稿するとタイムラインに出る", async ({ page }) => {
	const content = uniqueText("ホームから投稿");
	const form = page.getByRole("main");

	await form.getByPlaceholder("今どうしてる？").fill(content);
	await form.getByRole("button", { name: "投稿する" }).click();

	await expect(notification(page, "投稿に成功しました！")).toBeVisible();
	await expect(postCard(page, content)).toBeVisible();
	await expect(form.getByPlaceholder("今どうしてる？")).toHaveValue("");
});

test("サイドバーのボタンからモーダルで投稿できる", async ({ page }) => {
	const content = uniqueText("モーダルから投稿");

	await page.getByRole("navigation").getByRole("button", { name: "投稿する" }).click();
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();
	await dialog.getByPlaceholder("今どうしてる？").fill(content);
	await dialog.getByRole("button", { name: "投稿する" }).click();

	await expect(dialog).toBeHidden();
	await expect(postCard(page, content)).toBeVisible();
});

test("コードブロックはハイライトして表示する", async ({ page }) => {
	const content = uniqueText("コード");
	const form = page.getByRole("main");

	await form
		.getByPlaceholder("今どうしてる？")
		.fill(`${content}\n\`\`\`ts\nconst answer: number = 42;\n\`\`\``);
	await form.getByRole("button", { name: "投稿する" }).click();

	const code = postCard(page, content).locator("pre");
	await expect(code).toContainText("const answer: number = 42;");
	// トークンごとに色が付いている
	expect(await code.locator("span").count()).toBeGreaterThan(1);
});

test("いいねを付けて外せる。再読み込みしても残る", async ({ page }) => {
	const content = uniqueText("いいね");
	await page.getByRole("main").getByPlaceholder("今どうしてる？").fill(content);
	await page.getByRole("main").getByRole("button", { name: "投稿する" }).click();
	const card = postCard(page, content);

	await card.getByRole("button", { name: "いいね", exact: true }).click();
	await expect(card.getByRole("button", { name: "いいねを取り消す" })).toHaveText("1");

	await page.reload();
	await expect(card.getByRole("button", { name: "いいねを取り消す" })).toHaveText("1");

	await card.getByRole("button", { name: "いいねを取り消す" }).click();
	await expect(card.getByRole("button", { name: "いいね", exact: true })).toHaveText("0");
});

test("投稿の詳細でコメントすると、コメント一覧とコメント数に反映される", async ({ page }) => {
	const content = uniqueText("コメントされる投稿");
	const comment = uniqueText("コメント");
	await page.getByRole("main").getByPlaceholder("今どうしてる？").fill(content);
	await page.getByRole("main").getByRole("button", { name: "投稿する" }).click();

	await postCard(page, content).getByText(content).click();
	await expect(page).toHaveURL(/\/posts\/[0-9a-f-]+$/);
	await expect(page).toHaveTitle("投稿 | Engineer-SNS");

	await page.getByPlaceholder("コメント").fill(comment);
	await page.getByRole("button", { name: "コメントする" }).click();
	await expect(notification(page, "コメントに成功しました！")).toBeVisible();
	await expect(postCard(page, comment)).toBeVisible();

	await page.goto("/");
	await expect(page).toHaveTitle("ホーム | Engineer-SNS");
	await expect(postCard(page, content).getByRole("link", { name: "コメント" })).toHaveText("1");
});

test("自分の投稿はメニューから削除できる", async ({ page }) => {
	const content = uniqueText("削除する投稿");
	await page.getByRole("main").getByPlaceholder("今どうしてる？").fill(content);
	await page.getByRole("main").getByRole("button", { name: "投稿する" }).click();

	await postCard(page, content).getByRole("button", { name: "投稿メニュー" }).click();
	await page.getByRole("menuitem", { name: "削除" }).click();

	await expect(notification(page, "削除しました。")).toBeVisible();
	await expect(postCard(page, content)).toHaveCount(0);
});

test("存在しない投稿は 404 を表示する", async ({ page }) => {
	await page.goto("/posts/00000000-0000-0000-0000-000000000000");

	await expect(page.getByText("ページが見つかりません。")).toBeVisible();
	await page.getByRole("link", { name: "ホームへ戻る" }).click();
	await expect(page).toHaveTitle("ホーム | Engineer-SNS");
});
