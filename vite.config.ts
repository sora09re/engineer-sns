import { defineConfig } from "vite-plus";
import type { OxlintOverride } from "vite-plus/lint";

const ignorePatterns = [
	"**/dist/**",
	"**/node_modules/**",
	"apps/web/src/app/routeTree.gen.ts",
	"supabase/.temp/**",
];

const layers = (...names: string[]) => {
	return names.flatMap((name) => [`**/${name}`, `**/${name}/**`]);
};

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

const frameworkPackages = ["hono", "drizzle-orm", "postgres", "jose", "@engineer-sns/shared"];

export default defineConfig({
	lint: {
		ignorePatterns,
		jsPlugins: ["./lint/no-comments.ts"],
		rules: {
			"local/no-comments": "error",
		},
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
		"*.{js,ts,cjs,mjs,mts,d.cts,d.mts,jsx,tsx,json,jsonc,md}": "vp check --fix --deny-warnings",
	},
});
