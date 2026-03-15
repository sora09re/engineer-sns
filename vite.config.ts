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
	// Vitest（vitest.config.ts から移行）
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest-setup.ts"],
	},
	// Oxlint（Biome linting の置き換え）
	lint: {
		ignorePatterns: ["public/**", ".next/**", "node_modules/**"],
	},
	// Oxfmt（Biome formatting の置き換え）
	fmt: {
		useTabs: true,
		singleQuote: false,
	},
});
