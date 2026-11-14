import { defineConfig, devices } from "@playwright/test";

/**
 * E2E と VRT。ローカルの Supabase（pnpm exec supabase start）が起動している前提。
 * - e2e: 動きの確認（合否の判定に使う）
 * - vrt-*: 見た目の確認（差分は人が見て判断する）
 */
/** E2E 専用のポート */
const WEB_PORT = 5179;
const API_PORT = 8788;

export default defineConfig({
	testDir: "./e2e",
	globalSetup: "./e2e/global-setup.ts",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0,
	reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
	use: {
		baseURL: `http://localhost:${WEB_PORT}`,
		locale: "ja-JP",
		timezoneId: "Asia/Tokyo",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	expect: {
		// 開発サーバーは初回にルートのチャンクを変換するので、並列で動かすと表示まで数秒かかることがある
		timeout: 15_000,
		toHaveScreenshot: { animations: "disabled", caret: "hide", maxDiffPixelRatio: 0.001 },
	},
	snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
	projects: [
		{
			name: "e2e",
			testDir: "./e2e/flows",
			use: { ...devices["Desktop Chrome"] },
		},
		// スマホ幅にはまだ対応していないので、VRT はデスクトップだけ撮る（対応したらスマホ幅のプロジェクトを足す）
		{
			name: "vrt-desktop",
			testDir: "./e2e/vrt",
			use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
		},
	],
	// 毎回このチェックアウトのサーバーを、開発用（5173 / 8787）とは別のポートで起動する。
	// 既存のサーバーを再利用すると、別の worktree のサーバーを試してしまうことがある。
	// ポートが使われていれば、再利用せずにエラーで止まる
	webServer: [
		{
			command: `pnpm --filter @engineer-sns/api dev`,
			env: { API_PORT: String(API_PORT) },
			url: `http://localhost:${API_PORT}/api/posts/timeline`,
			// トークンなしの 401 が返れば起動している（Playwright は 400〜403 も起動済みとみなす）
			reuseExistingServer: false,
		},
		{
			command: `pnpm --filter @engineer-sns/web dev --port ${WEB_PORT} --strictPort`,
			env: { API_PORT: String(API_PORT) },
			url: `http://localhost:${WEB_PORT}`,
			reuseExistingServer: false,
		},
	],
});
