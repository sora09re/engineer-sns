/// <reference types="vite-plus/test" />

import path from "node:path";
import { fileURLToPath } from "node:url";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		// API（apps/api）へは同一オリジンの /api として届ける。本番の Vercel と同じ形
		proxy: {
			"/api": "http://localhost:8787",
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest-setup.ts"],
	},
});
