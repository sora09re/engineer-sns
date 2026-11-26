export default {
	testRunner: "command",
	commandRunner: { command: "pnpm exec vp test run" },
	mutate: ["src/**/lib/**/*.{ts,tsx}", "!src/**/*.test.{ts,tsx}", "!src/**/index.ts"],
	reporters: ["clear-text", "progress", "html"],
	htmlReporter: { fileName: "reports/mutation/index.html" },
	thresholds: { high: 80, low: 60, break: null },
	tempDirName: ".stryker-tmp",
	concurrency: 2,
};
