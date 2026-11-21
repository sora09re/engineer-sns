import { defineConfig, devices } from "@playwright/test";

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
		{
			name: "vrt-desktop",
			testDir: "./e2e/vrt",
			use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
		},
	],
	webServer: [
		{
			command: `pnpm --filter @engineer-sns/api dev`,
			env: { API_PORT: String(API_PORT) },
			url: `http://localhost:${API_PORT}/api/posts/timeline`,
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
