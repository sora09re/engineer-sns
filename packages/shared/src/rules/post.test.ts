import fc from "fast-check";
import { describe, expect, it } from "vite-plus/test";

import { isValidPostContent } from "./post";

const whitespace = fc.string({ unit: fc.constantFrom(" ", "\t", "\n", "\r", "　", " ") });
const visibleChar = fc.constantFrom("a", "Z", "0", "_", "あ", "`", "😀");

describe("isValidPostContent", () => {
	it("空文字は投稿できない", () => {
		expect(isValidPostContent("")).toBe(false);
	});

	it("空白と改行だけの本文は投稿できない", () => {
		fc.assert(
			fc.property(whitespace, (content) => {
				expect(isValidPostContent(content)).toBe(false);
			}),
		);
	});

	it("空白でない文字が 1 つでもあれば投稿できる", () => {
		fc.assert(
			fc.property(whitespace, visibleChar, fc.string(), whitespace, (before, char, rest, after) => {
				expect(isValidPostContent(`${before}${char}${rest}${after}`)).toBe(true);
			}),
		);
	});

	it("前後に空白を足しても、投稿できるかどうかは変わらない", () => {
		fc.assert(
			fc.property(fc.string(), whitespace, whitespace, (content, before, after) => {
				expect(isValidPostContent(`${before}${content}${after}`)).toBe(isValidPostContent(content));
			}),
		);
	});
});
