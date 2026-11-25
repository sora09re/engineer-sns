import fc from "fast-check";
import { describe, expect, it } from "vite-plus/test";

import { parseContent } from "./parseContent";

describe("parseContent", () => {
	it("コードブロックがなければ、全体を 1 つのテキストとして返す", () => {
		expect(parseContent("こんにちは")).toEqual([
			{ content: "こんにちは", language: "", offset: 0, type: "text" },
		]);
	});

	it("``` で囲まれた部分をコードとして分け、先頭行を言語として取り除く", () => {
		const parts = parseContent("前の文\n```ts\nconst a = 1;\n```\n後の文");

		expect(parts.map((part) => part.type)).toEqual(["text", "code", "text"]);
		expect(parts[0].content).toBe("前の文\n");
		expect(parts[1]).toEqual({
			content: "const a = 1;\n",
			language: "ts",
			offset: 7,
			type: "code",
		});
		expect(parts[2].content).toBe("\n後の文");
	});

	it("言語の指定がないコードブロックは、言語を空にして中身をそのまま残す", () => {
		const parts = parseContent("```\nplain code\n```");

		expect(parts[1]).toEqual({ content: "\nplain code\n", language: "", offset: 3, type: "code" });
	});

	it("複数のコードブロックをそれぞれの言語で分ける", () => {
		const parts = parseContent("```js\na\n```\n間\n```py\nb\n```");
		const codes = parts.filter((part) => part.type === "code");

		expect(codes).toEqual([
			{ content: "a\n", language: "js", offset: 3, type: "code" },
			{ content: "b\n", language: "py", offset: 17, type: "code" },
		]);
	});

	it("言語の指定がないコードブロックは、前のコードブロックの言語を引き継がない", () => {
		const parts = parseContent("```ts\na\n```\n```\nb\n```");
		const codes = parts.filter((part) => part.type === "code");

		expect(codes.map((part) => part.language)).toEqual(["ts", ""]);
	});

	it("それぞれの部分に、元の本文の中で始まる位置を持たせる", () => {
		const content = "前\n```ts\nx\n```\n後";

		const offsets = parseContent(content).map((part) => part.offset);

		expect(offsets).toEqual([0, content.indexOf("```") + 3, content.lastIndexOf("```") + 3]);
	});
});

const fence = "```";
const plain = fc
	.string({
		unit: fc.oneof(fc.constantFrom("\n", " ", "あ"), fc.string({ minLength: 1, maxLength: 1 })),
	})
	.map((s) => {
		return s.replaceAll("`", "'");
	});
const language = fc.stringMatching(/^[a-zA-Z0-9]{1,8}$/);
const codeBlock = fc.oneof(
	fc.record({ language, body: plain }),
	fc.record({
		language: fc.constant(""),
		body: plain.filter((body) => {
			return !/^[a-zA-Z0-9]+\n/.test(body);
		}),
	}),
);
const document = fc.record({
	head: plain,
	blocks: fc.array(fc.record({ code: codeBlock, after: plain }), { maxLength: 4 }),
	unclosed: fc.option(codeBlock, { nil: undefined }),
});

type Document = typeof document extends fc.Arbitrary<infer T> ? T : never;

const render = ({ head, blocks, unclosed }: Document) => {
	const opening = (code: { language: string; body: string }) => {
		return `${fence}${code.language ? `${code.language}\n` : ""}${code.body}`;
	};
	return (
		head +
		blocks
			.map(({ code, after }) => {
				return `${opening(code)}${fence}${after}`;
			})
			.join("") +
		(unclosed ? opening(unclosed) : "")
	);
};

const expectedParts = ({ head, blocks, unclosed }: Document) => {
	const parts: { type: "text" | "code"; content: string; language?: string; offset: number }[] = [];
	let offset = 0;
	const push = (type: "text" | "code", raw: string, content: string, language?: string) => {
		parts.push({ type, content, language, offset });
		offset += raw.length + fence.length;
	};
	const pushCode = (code: { language: string; body: string }) => {
		const raw = `${code.language ? `${code.language}\n` : ""}${code.body}`;
		push("code", raw, code.body, code.language);
	};
	push("text", head, head);
	for (const { code, after } of blocks) {
		pushCode(code);
		push("text", after, after);
	}
	if (unclosed) {
		pushCode(unclosed);
	}
	return parts;
};

describe("parseContent（性質）", () => {
	it("どんな本文でも、テキストとコードが交互に並び、各部分は元の本文のその位置にある", () => {
		fc.assert(
			fc.property(fc.string({ unit: fc.constantFrom("`", "a", "1", "\n", " ") }), (content) => {
				const parts = parseContent(content);

				expect(parts).toHaveLength(content.split(fence).length);
				parts.forEach((part, index) => {
					expect(part.type).toBe(index % 2 === 0 ? "text" : "code");
					const end = parts[index + 1]?.offset ?? content.length + fence.length;
					const raw = content.slice(part.offset, end - fence.length);
					if (part.type === "text") {
						expect(part.content).toBe(raw);
					} else {
						expect(raw.endsWith(part.content)).toBe(true);
					}
				});
			}),
		);
	});

	it("テキストとコードブロックから組み立てた本文を、元のテキスト・コード・言語に分け直す", () => {
		fc.assert(
			fc.property(document, (doc) => {
				const parts = parseContent(render(doc));
				const expected = expectedParts(doc);

				expect(parts.map(({ type, content, offset }) => ({ type, content, offset }))).toEqual(
					expected.map(({ type, content, offset }) => ({ type, content, offset })),
				);
				expect(parts.filter((part) => part.type === "code").map((part) => part.language)).toEqual(
					expected.filter((part) => part.type === "code").map((part) => part.language),
				);
			}),
		);
	});
});
