// ローカルの Supabase から apps/web/src/api/database.types.ts を生成する。
// シェルの `>` で書き込むと、コマンドが失敗したときに既存のファイルが空になるので、
// 出力をいったん受け取り、成功したときだけ書き込む。
// 追加の引数は supabase にそのまま渡す（例: pnpm db:types --workdir <dir>）。
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const OUTPUT = "apps/web/src/api/database.types.ts";

let types;
try {
	types = execFileSync(
		"supabase",
		["gen", "types", "typescript", "--local", "--schema", "public", ...process.argv.slice(2)],
		{ encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
	);
} catch {
	console.error(`型の生成に失敗したため、${OUTPUT} は変更していません。`);
	process.exit(1);
}

if (!types.trim()) {
	console.error(`生成結果が空だったため、${OUTPUT} は変更していません。`);
	process.exit(1);
}

writeFileSync(OUTPUT, types);
console.log(`${OUTPUT} を更新しました。`);
