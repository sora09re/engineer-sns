import { insertRows } from "../support/supabase";
import { expect, postCard, test } from "../support/test";

test("フォローするとフォロワー数とタイムラインに反映され、解除すると戻る", async ({
	page,
	createUser,
	signIn,
}) => {
	const me = await createUser();
	const other = await createUser({ name: "フォローされる人" });
	const otherPost = `フォローされる人の投稿 ${crypto.randomUUID().slice(0, 8)}`;
	await insertRows("posts", [{ user_id: other.id, content: otherPost }]);
	await signIn(me);

	// フォロー前はタイムラインに出ない
	await page.goto("/");
	await expect(page).toHaveTitle("ホーム | Engineer-SNS");
	await expect(postCard(page, otherPost)).toHaveCount(0);

	await page.goto(`/profile/${other.id}`);
	const followerCount = page.getByRole("link", { name: /フォロワー/ });
	await expect(followerCount).toHaveText("0フォロワー");

	await page.getByRole("button", { name: "フォロー", exact: true }).click();
	await expect(page.getByRole("button", { name: /フォロー中|フォロー解除/ })).toBeVisible();
	await expect(followerCount).toHaveText("1フォロワー");

	// フォロー一覧に自分が出る
	await followerCount.click();
	await expect(page).toHaveTitle("フォロー | Engineer-SNS");
	await expect(page.getByRole("tabpanel").getByText(`@${me.username}`)).toBeVisible();

	await page.goto("/");
	await expect(postCard(page, otherPost)).toBeVisible();

	// 解除（ボタンはホバーすると「フォロー解除」になる）
	await page.goto(`/profile/${other.id}`);
	const unfollow = page.getByRole("button", { name: /フォロー中|フォロー解除/ });
	await unfollow.hover();
	await expect(unfollow).toHaveText("フォロー解除");
	await unfollow.click();
	await expect(page.getByRole("button", { name: "フォロー", exact: true })).toBeVisible();
	await expect(followerCount).toHaveText("0フォロワー");
});

test("キーワードで投稿とアカウントを検索できる", async ({ page, createUser, signIn }) => {
	const keyword = `kw${crypto.randomUUID().slice(0, 8)}`;
	const me = await createUser();
	const author = await createUser({ name: `著者 ${keyword}` });
	await insertRows("posts", [{ user_id: author.id, content: `検索される投稿 ${keyword}` }]);
	await signIn(me);

	await page.goto("/search");
	await expect(page).toHaveTitle("検索 | Engineer-SNS");
	await page.getByPlaceholder("キーワード検索").fill(keyword);

	await expect(postCard(page, `検索される投稿 ${keyword}`)).toBeVisible();

	await page.getByRole("tab", { name: "アカウント" }).click();
	await expect(page.getByRole("tabpanel").getByText(`@${author.username}`)).toBeVisible();
	await expect(page.getByRole("tabpanel").getByText(`@${me.username}`)).toHaveCount(0);
});
