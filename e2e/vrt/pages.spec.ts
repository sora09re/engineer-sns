/**
 * 見た目の記録。差分が出たら人が見て判断し、問題なければ pnpm vrt:update で基準を更新する。
 * データは e2e/support/vrt-fixtures.ts の固定データだけが映るようにしている。
 */
import type { Page } from "@playwright/test";

import { expect, postCard, signIn, test } from "../support/test";
import { ALICE, BOB, NEWBIE, POSTS, VRT_KEYWORD, VRT_PASSWORDS_ENV } from "../support/vrt-fixtures";

const passwordOf = (email: string) => {
	const passwords = JSON.parse(process.env[VRT_PASSWORDS_ENV] ?? "{}") as Record<string, string>;
	const password = passwords[email];
	if (!password) {
		throw new Error(`${email} のパスワードがありません（global setup が動いていない）。`);
	}
	return password;
};

const signInAs = (page: Page, account: { id: string; email: string }) => {
	return signIn(page, { ...account, password: passwordOf(account.email) });
};

/**
 * モーダルやメニューを開く。今のレイアウトはスマホ幅だと横にはみ出し、
 * タップ位置が別の要素に重なるため、クリックイベントを要素に直接送る。
 * 操作できるかどうかは e2e/flows で確かめる。VRT では見た目だけを記録する。
 */
const open = async (target: ReturnType<Page["locator"]>) => {
	// Mantine 9 の Popover はトリガーが画面外だとドロップダウンを隠すので、先に画面内へスクロールする
	await target.scrollIntoViewIfNeeded();
	await target.dispatchEvent("click");
};

const capture = async (page: Page, name: string) => {
	await page.waitForLoadState("networkidle");
	await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
};

test.describe("未ログイン", () => {
	test("ログイン", async ({ page }) => {
		await page.goto("/auth/signin");
		await expect(page.getByRole("button", { name: "Githubでログイン" })).toBeVisible();
		await capture(page, "signin");
	});

	test("新規ユーザー登録", async ({ page }) => {
		await signInAs(page, NEWBIE);
		await page.goto("/auth/new-user");
		await expect(page.getByLabel("名前")).toBeVisible();
		await capture(page, "new-user");
	});
});

test.describe("ログイン済み（Alice）", () => {
	test.beforeEach(async ({ page }) => {
		await signInAs(page, ALICE);
	});

	test("ホーム", async ({ page }) => {
		await page.goto("/");
		await expect(postCard(page, "TypeScript のコードです。")).toBeVisible();
		await capture(page, "home");
	});

	test("投稿の詳細", async ({ page }) => {
		await page.goto(`/posts/${POSTS.bobFirst}`);
		await expect(postCard(page, "よろしくお願いします！")).toBeVisible();
		await capture(page, "post-detail");
	});

	test("自分のプロフィール", async ({ page }) => {
		await page.goto(`/profile/${ALICE.id}`);
		await expect(page.getByRole("button", { name: "プロフィールを編集" })).toBeVisible();
		await capture(page, "profile-self");
	});

	test("ほかの人のプロフィール", async ({ page }) => {
		await page.goto(`/profile/${BOB.id}`);
		await expect(page.getByRole("button", { name: "フォロー中" })).toBeVisible();
		await capture(page, "profile-other");
	});

	test("フォロー一覧", async ({ page }) => {
		await page.goto(`/profile/${ALICE.id}/follows`);
		await expect(page.getByRole("tabpanel").getByText(`@${BOB.username}`)).toBeVisible();
		await capture(page, "follows");
	});

	test("検索（投稿）", async ({ page }) => {
		await page.goto("/search");
		await page.getByPlaceholder("キーワード検索").fill(VRT_KEYWORD);
		await expect(postCard(page, "Alice の投稿です。")).toBeVisible();
		await capture(page, "search-posts");
	});

	test("検索（アカウント）", async ({ page }) => {
		await page.goto("/search");
		await page.getByPlaceholder("キーワード検索").fill("VRT 用の");
		await open(page.getByRole("tab", { name: "アカウント" }));
		await expect(page.getByRole("tabpanel").getByText(`@${BOB.username}`)).toBeVisible();
		await capture(page, "search-accounts");
	});

	test("投稿のモーダル", async ({ page }) => {
		await page.goto("/");
		await open(page.getByRole("navigation").getByRole("button", { name: "投稿する" }));
		await expect(page.getByRole("dialog")).toBeVisible();
		await capture(page, "modal-post");
	});

	test("プロフィール編集のモーダル", async ({ page }) => {
		await page.goto(`/profile/${ALICE.id}`);
		await open(page.getByRole("button", { name: "プロフィールを編集" }));
		await expect(page.getByRole("dialog", { name: "プロフィールを編集" })).toBeVisible();
		await capture(page, "modal-edit-profile");
	});

	test("投稿のメニュー", async ({ page }) => {
		await page.goto(`/profile/${ALICE.id}`);
		await open(postCard(page, "Alice の投稿です。").getByRole("button", { name: "投稿メニュー" }));
		await expect(page.getByRole("menuitem", { name: "削除" })).toBeVisible();
		await capture(page, "menu-post");
	});

	test("404", async ({ page }) => {
		await page.goto("/posts/00000000-0000-0000-0000-000000000000");
		await expect(page.getByText("ページが見つかりません。")).toBeVisible();
		await capture(page, "not-found");
	});
});
