/// <reference types="vite-plus/test" />

import path from "node:path";
import { fileURLToPath } from "node:url";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const ignorePatterns = [
	"dist/**",
	"node_modules/**",
	"src/routeTree.gen.ts",
	"src/api/database.types.ts",
	"supabase/.temp/**",
];

export default defineConfig({
	plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest-setup.ts"],
		// e2e/ は Playwright で動かす
		exclude: ["**/node_modules/**", "e2e/**"],
	},
	lint: {
		ignorePatterns,
	},
	fmt: {
		ignorePatterns,
		useTabs: true,
		singleQuote: false,
	},
	staged: {
		"*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": "vp check --fix",
	},
});
