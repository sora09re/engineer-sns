/// <reference types="vitest" />

import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	oxc: {
		jsx: { runtime: "automatic" },
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest-setup.ts"],
	},
	lint: {
		ignorePatterns: ["public/**", ".next/**", "node_modules/**"],
	},
	fmt: {
		ignorePatterns: ["public/**", ".next/**", "node_modules/**"],
		useTabs: true,
		singleQuote: false,
	},
	staged: {
		"*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": "vp check --fix",
	},
});
