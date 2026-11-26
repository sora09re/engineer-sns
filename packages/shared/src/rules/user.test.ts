import fc from "fast-check";
import { describe, expect, it } from "vite-plus/test";

import { BIO_MAX_LENGTH, findUserValuesError } from "./user";

const requiredFields = [
	["name", "名前"],
	["username", "ユーザーネーム"],
	["email", "メールアドレス"],
] as const;

const whitespace = fc.string({ unit: fc.constantFrom(" ", "\t", "\n", "　") });
const filled = fc
	.tuple(whitespace, fc.constantFrom("a", "あ", "0", "@"), fc.string(), whitespace)
	.map((parts) => {
		return parts.join("");
	});
const optionalFilled = fc.option(filled, { nil: undefined });
const requiredValue = fc.oneof(fc.constant(undefined), whitespace, filled);
const allowedBio = fc.string({ maxLength: BIO_MAX_LENGTH });
const tooLongBio = fc.string({ minLength: BIO_MAX_LENGTH + 1, maxLength: BIO_MAX_LENGTH * 2 });

const isBlank = (value: string | undefined) => {
	return value !== undefined && value.trim() === "";
};

describe("findUserValuesError", () => {
	it("自己紹介は上限の文字数ちょうどまで受け付け、1 文字でも超えると断る", () => {
		expect(findUserValuesError({ bio: "a".repeat(BIO_MAX_LENGTH) })).toBe(null);
		expect(findUserValuesError({ bio: "a".repeat(BIO_MAX_LENGTH + 1) })).toBe(
			"自己紹介は160文字以内で入力してください。",
		);
	});

	it("何も渡さなければ、エラーはない", () => {
		expect(findUserValuesError({})).toBe(null);
	});

	it("必須の項目が空でなく、自己紹介が上限以下なら、エラーはない", () => {
		fc.assert(
			fc.property(
				optionalFilled,
				optionalFilled,
				optionalFilled,
				fc.option(allowedBio, { nil: undefined }),
				(name, username, email, bio) => {
					expect(findUserValuesError({ name, username, email, bio })).toBe(null);
				},
			),
		);
	});

	it("空の必須の項目があれば、名前・ユーザーネーム・メールアドレスの順で最初のものを知らせる", () => {
		fc.assert(
			fc.property(
				requiredValue,
				requiredValue,
				requiredValue,
				fc.option(fc.string(), { nil: undefined }),
				(name, username, email, bio) => {
					const values = { name, username, email, bio };
					const firstBlank = requiredFields.find(([field]) => {
						return isBlank(values[field]);
					});
					fc.pre(firstBlank !== undefined);

					expect(findUserValuesError(values)).toBe(`${firstBlank?.[1]}を入力してください。`);
				},
			),
		);
	});

	it("必須の項目が埋まっていて自己紹介が長すぎれば、自己紹介のエラーになる", () => {
		fc.assert(
			fc.property(
				optionalFilled,
				optionalFilled,
				optionalFilled,
				tooLongBio,
				(name, username, email, bio) => {
					expect(findUserValuesError({ name, username, email, bio })).toBe(
						"自己紹介は160文字以内で入力してください。",
					);
				},
			),
		);
	});
});
