/// <reference types="vitest"/>

import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest-setup.ts"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
