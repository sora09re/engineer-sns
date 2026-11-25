import fc from "fast-check";
import { describe, expect, it } from "vite-plus/test";

import {
	findProfileImageError,
	isProfileImageMimeType,
	PROFILE_IMAGE_MAX_SIZE,
	PROFILE_IMAGE_MIME_TYPES,
} from "./profile-image";

const supportedType = fc.constantFrom(...PROFILE_IMAGE_MIME_TYPES);
const unsupportedType = fc
	.oneof(
		fc.constantFrom("image/svg+xml", "image/bmp", "image/heic", "IMAGE/PNG", "image/jpg", ""),
		fc.string(),
	)
	.filter((type) => {
		return !(PROFILE_IMAGE_MIME_TYPES as readonly string[]).includes(type);
	});
const allowedSize = fc.integer({ min: 0, max: PROFILE_IMAGE_MAX_SIZE });
const tooLargeSize = fc.integer({ min: PROFILE_IMAGE_MAX_SIZE + 1, max: 100 * 1024 * 1024 });
const anySize = fc.oneof(allowedSize, tooLargeSize);

describe("findProfileImageError", () => {
	it("上限ちょうどの大きさは受け付け、1 バイトでも超えると断る", () => {
		expect(findProfileImageError({ contentType: "image/png", size: PROFILE_IMAGE_MAX_SIZE })).toBe(
			null,
		);
		expect(
			findProfileImageError({ contentType: "image/png", size: PROFILE_IMAGE_MAX_SIZE + 1 }),
		).toBe("画像は3MBまでです。");
	});

	it("対応している形式で上限以下なら、エラーはない", () => {
		fc.assert(
			fc.property(supportedType, allowedSize, (contentType, size) => {
				expect(findProfileImageError({ contentType, size })).toBe(null);
			}),
		);
	});

	it("対応している形式でも上限を超えると、大きさのエラーになる", () => {
		fc.assert(
			fc.property(supportedType, tooLargeSize, (contentType, size) => {
				expect(findProfileImageError({ contentType, size })).toBe("画像は3MBまでです。");
			}),
		);
	});

	it("対応していない形式は、大きさにかかわらず形式のエラーになる", () => {
		fc.assert(
			fc.property(unsupportedType, anySize, (contentType, size) => {
				expect(findProfileImageError({ contentType, size })).toBe("対応していない画像形式です。");
			}),
		);
	});
});

describe("isProfileImageMimeType", () => {
	it("対応している形式だけを受け付ける", () => {
		fc.assert(
			fc.property(supportedType, unsupportedType, (supported, unsupported) => {
				expect(isProfileImageMimeType(supported)).toBe(true);
				expect(isProfileImageMimeType(unsupported)).toBe(false);
			}),
		);
	});
});
