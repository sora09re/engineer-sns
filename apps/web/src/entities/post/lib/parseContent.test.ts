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

	it("それぞれの部分に、元の本文の中で始まる位置を持たせる", () => {
		const content = "前\n```ts\nx\n```\n後";

		const offsets = parseContent(content).map((part) => part.offset);

		expect(offsets).toEqual([0, content.indexOf("```") + 3, content.lastIndexOf("```") + 3]);
	});
});
