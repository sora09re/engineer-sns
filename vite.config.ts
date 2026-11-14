import { defineConfig } from "vite-plus";

// ワークスペース全体の lint / fmt / staged。アプリごとの設定は apps/*/vite.config.ts に置く
const ignorePatterns = [
	"**/dist/**",
	"**/node_modules/**",
	"apps/web/src/routeTree.gen.ts",
	"apps/web/src/api/database.types.ts",
	"supabase/.temp/**",
];

export default defineConfig({
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
