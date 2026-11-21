import { readFileSync } from "node:fs";
import path from "node:path";
import { definePlugin, defineRule } from "vite-plus/lint/plugins";

const baselinePath = path.join(import.meta.dirname, "comment-baseline.json");

const directivePatterns = [
	/^\/\s*<reference\s/,
	/^\s*@ts-expect-error\b/,
	/^\s*(oxlint|eslint)-(disable|enable)/,
	/^\s*[#@]__(PURE|NO_SIDE_EFFECTS)__\s*$/,
	/^\s*@vite-ignore\s*$/,
];

const isDirective = (value: string) => {
	return directivePatterns.some((pattern) => {
		return pattern.test(value);
	});
};

let baseline: Record<string, number> | undefined;

const readBaseline = () => {
	baseline ??= JSON.parse(readFileSync(baselinePath, "utf8")) as Record<string, number>;
	return baseline;
};

const noComments = defineRule({
	meta: {
		messages: {
			noComment:
				"コメントを書かない。判断の記録は docs/adr/ に、直すべき実装は issue に移す（/delete-comment）。",
			overBaseline:
				"このファイルのコメントは {{baseline}} 個まで（今 {{count}} 個）。新しいコメントを足さない（/delete-comment）。",
			staleBaseline:
				"コメントが {{count}} 個に減った。pnpm comments baseline で lint/comment-baseline.json を更新する。",
		},
	},
	create(context) {
		return {
			"Program:exit"(program) {
				const comments = context.sourceCode.getAllComments().filter((comment) => {
					return comment.type !== "Shebang" && !isDirective(comment.value);
				});
				if (process.env.NO_COMMENTS_REPORT_ALL === "1") {
					for (const comment of comments) {
						context.report({ loc: comment.loc, messageId: "noComment" });
					}
					return;
				}
				const file = path.relative(context.cwd, context.filename).split(path.sep).join("/");
				const allowed = readBaseline()[file] ?? 0;
				const count = comments.length;
				if (count > allowed) {
					for (const comment of comments) {
						context.report({
							loc: comment.loc,
							messageId: allowed === 0 ? "noComment" : "overBaseline",
							data: { baseline: String(allowed), count: String(count) },
						});
					}
				} else if (count < allowed) {
					context.report({
						node: program,
						messageId: "staleBaseline",
						data: { count: String(count) },
					});
				}
			},
		};
	},
});

export default definePlugin({
	meta: { name: "local" },
	rules: { "no-comments": noComments },
});
