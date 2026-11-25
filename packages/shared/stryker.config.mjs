export default {
	testRunner: "command",
	commandRunner: { command: "pnpm exec vp test run" },
	mutate: ["src/rules/**/*.ts", "!src/rules/**/*.test.ts", "!src/rules/index.ts"],
	reporters: ["clear-text", "progress", "html"],
	htmlReporter: { fileName: "reports/mutation/index.html" },
	thresholds: { high: 80, low: 60, break: null },
	tempDirName: ".stryker-tmp",
};
