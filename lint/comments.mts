import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Comment = { file: string; line: number; start: number; end: number; text: string };

type Diagnostic = {
	code: string;
	filename: string;
	labels: { span: { offset: number; length: number; line: number } }[];
};

const root = path.join(import.meta.dirname, "..");
const baselinePath = path.join(import.meta.dirname, "comment-baseline.json");

const collect = (): Comment[] => {
	let output: string;
	try {
		output = execFileSync("pnpm", ["exec", "vp", "lint", "--format", "json"], {
			cwd: root,
			env: { ...process.env, NO_COMMENTS_REPORT_ALL: "1" },
			encoding: "utf8",
			maxBuffer: 64 * 1024 * 1024,
		});
	} catch (error) {
		output = (error as { stdout: string }).stdout;
	}
	const { diagnostics } = JSON.parse(output) as { diagnostics: Diagnostic[] };
	return diagnostics
		.filter((diagnostic) => {
			return diagnostic.code === "local(no-comments)";
		})
		.map((diagnostic) => {
			const { offset, length, line } = diagnostic.labels[0].span;
			const source = readFileSync(path.join(root, diagnostic.filename));
			const text = source.subarray(offset, offset + length).toString("utf8");
			return { file: diagnostic.filename, line, start: offset, end: offset + length, text };
		})
		.sort((a, b) => {
			return a.file.localeCompare(b.file) || a.start - b.start;
		});
};

const isBlank = (byte: number | undefined) => {
	return byte === 0x20 || byte === 0x09;
};

const removalRange = (source: Buffer, comment: Comment) => {
	let start = comment.start;
	let end = comment.end;
	let before = start - 1;
	while (isBlank(source[before])) before--;
	let after = end;
	while (isBlank(source[after])) after++;
	if (source[before] === 0x7b && source[after] === 0x7d) {
		start = before;
		end = after + 1;
	}
	let lineStart = start;
	while (lineStart > 0 && isBlank(source[lineStart - 1])) lineStart--;
	let lineEnd = end;
	while (isBlank(source[lineEnd])) lineEnd++;
	const startsLine = lineStart === 0 || source[lineStart - 1] === 0x0a;
	const endsLine = lineEnd === source.length || source[lineEnd] === 0x0a;
	if (startsLine && endsLine) {
		return { start: lineStart, end: Math.min(lineEnd + 1, source.length) };
	}
	if (endsLine) {
		return { start: lineStart, end: lineEnd };
	}
	return { start, end: after };
};

const remove = (comments: Comment[]) => {
	const byFile = Map.groupBy(comments, (comment) => {
		return comment.file;
	});
	for (const [file, fileComments] of byFile) {
		const filePath = path.join(root, file);
		let source = readFileSync(filePath);
		const ordered = fileComments.toSorted((a, b) => {
			return b.start - a.start;
		});
		for (const comment of ordered) {
			const { start, end } = removalRange(source, comment);
			source = Buffer.concat([source.subarray(0, start), source.subarray(end)]);
		}
		writeFileSync(filePath, source);
	}
	return [...byFile.keys()];
};

const countByFile = (comments: Comment[]) => {
	const counts: Record<string, number> = {};
	for (const comment of comments) {
		counts[comment.file] = (counts[comment.file] ?? 0) + 1;
	}
	return counts;
};

const [command, ...args] = process.argv.slice(2);

if (command === "list") {
	for (const comment of collect()) {
		console.log(`### ${comment.file}:${comment.line}\n${comment.text}`);
	}
} else if (command === "delete") {
	if (args.length === 0) {
		console.error("delete には file または file:line を 1 つ以上渡す");
		process.exit(1);
	}
	const targets = new Set(args);
	const comments = collect().filter((comment) => {
		return targets.has(`${comment.file}:${comment.line}`) || targets.has(comment.file);
	});
	const files = remove(comments);
	if (files.length > 0) {
		execFileSync("pnpm", ["exec", "vp", "fmt", ...files], { cwd: root, stdio: "inherit" });
	}
	console.log(`${comments.length} comments removed from ${files.length} files`);
} else if (command === "baseline") {
	const counts = countByFile(collect());
	const sorted = Object.fromEntries(
		Object.entries(counts).toSorted(([a], [b]) => a.localeCompare(b)),
	);
	writeFileSync(baselinePath, `${JSON.stringify(sorted, null, "\t")}\n`);
	const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
	console.log(`baseline: ${total} comments in ${Object.keys(counts).length} files`);
} else {
	console.error("usage: node lint/comments.mts list | delete [file[:line] ...] | baseline");
	process.exit(1);
}
