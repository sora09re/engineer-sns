import { defineConfig } from "vite-plus";
import type { OxlintOverride } from "vite-plus/lint";

// ワークスペース全体の lint / fmt / staged。アプリごとの設定は apps/*/vite.config.ts に置く
const ignorePatterns = [
	"**/dist/**",
	"**/node_modules/**",
	"apps/web/src/routeTree.gen.ts",
	"apps/web/src/api/database.types.ts",
	"supabase/.temp/**",
];

/** apps/api の層の名前を、相対 import のパスで指すパターンにする */
const layers = (...names: string[]) => {
	return names.flatMap((name) => [`**/${name}`, `**/${name}/**`]);
};

/** layer の中から import してはいけないもの。違反したら、依存の向き（docs/adr/0002）を見直す */
const restrictImports = (
	layer: string,
	forbiddenLayers: string[],
	forbiddenPackages: string[] = [],
): OxlintOverride => {
	return {
		files: [`apps/api/src/${layer}/**`],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					paths: forbiddenPackages.map((name) => {
						return { name, message: `${layer} は ${name} に依存しない（docs/adr/0002）。` };
					}),
					patterns: [
						{
							group: layers(...forbiddenLayers),
							message: `${layer} から ${forbiddenLayers.join(" / ")} は import しない。依存は内側にだけ向ける（docs/adr/0002）。`,
						},
					],
				},
			],
		},
	};
};

/** domain と application は、フレームワークや DB のライブラリに依存しない */
const frameworkPackages = ["hono", "drizzle-orm", "postgres", "jose", "@engineer-sns/shared"];

export default defineConfig({
	lint: {
		ignorePatterns,
		// apps/api のオニオンアーキテクチャ: presentation / infrastructure → application → domain
		overrides: [
			restrictImports(
				"domain",
				["application", "infrastructure", "presentation", "app"],
				frameworkPackages,
			),
			restrictImports("application", ["infrastructure", "presentation", "app"], frameworkPackages),
			restrictImports("presentation", ["infrastructure", "app"]),
			restrictImports("infrastructure", ["presentation", "app"]),
		],
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
