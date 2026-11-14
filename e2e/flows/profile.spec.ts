import { deflateSync } from "node:zlib";

import { expect, notification, test } from "../support/test";

/** 単色の PNG を作る（アップロード用） */
const solidPng = (size: number, [r, g, b]: [number, number, number]) => {
	const crcTable = Array.from({ length: 256 }, (_, n) => {
		let c = n;
		for (let k = 0; k < 8; k++) {
			c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		return c >>> 0;
	});
	const crc = (buf: Buffer) => {
		let c = 0xffffffff;
		for (const byte of buf) {
			c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
		}
		return (c ^ 0xffffffff) >>> 0;
	};
	const chunk = (type: string, data: Buffer) => {
		const body = Buffer.concat([Buffer.from(type), data]);
		const length = Buffer.alloc(4);
		length.writeUInt32BE(data.length);
		const checksum = Buffer.alloc(4);
		checksum.writeUInt32BE(crc(body));
		return Buffer.concat([length, body, checksum]);
	};
	const header = Buffer.alloc(13);
	header.writeUInt32BE(size, 0);
	header.writeUInt32BE(size, 4);
	header[8] = 8; // bit depth
	header[9] = 2; // RGB
	const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array(size).fill([r, g, b]).flat())]);
	return Buffer.concat([
		Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		chunk("IHDR", header),
		chunk("IDAT", deflateSync(Buffer.concat(Array(size).fill(row)))),
		chunk("IEND", Buffer.alloc(0)),
	]);
};

test("プロフィールを編集すると、プロフィールとサイドバーに反映される", async ({
	page,
	createUser,
	signIn,
}) => {
	const user = await createUser();
	await signIn(user);
	await page.goto(`/profile/${user.id}`);
	await expect(page).toHaveTitle("プロフィール | Engineer-SNS");

	await page.getByRole("button", { name: "プロフィールを編集" }).click();
	const dialog = page.getByRole("dialog", { name: "プロフィールを編集" });
	await expect(dialog).toBeVisible();
	await dialog.getByLabel("名前").fill("編集後の名前");
	await dialog.getByLabel("自己紹介").fill("編集後の自己紹介です。");
	await dialog.getByLabel("場所").fill("Fukuoka");
	await dialog.getByRole("button", { name: "保存" }).click();

	await expect(notification(page, "更新に成功しました！")).toBeVisible();
	await expect(dialog).toBeHidden();
	const main = page.getByRole("main");
	await expect(main.getByText("編集後の名前").first()).toBeVisible();
	await expect(main.getByText("編集後の自己紹介です。")).toBeVisible();
	await expect(main.getByText("Fukuoka")).toBeVisible();
	await expect(page.getByRole("navigation").getByText("編集後の名前")).toBeVisible();
});

test("プロフィール画像をアップロードできる", async ({ page, createUser, signIn }) => {
	const user = await createUser();
	await signIn(user);
	await page.goto(`/profile/${user.id}`);

	await page.getByRole("button", { name: "プロフィールを編集" }).click();
	const dialog = page.getByRole("dialog", { name: "プロフィールを編集" });
	await dialog.locator('input[type="file"]').setInputFiles({
		name: "avatar.png",
		mimeType: "image/png",
		buffer: solidPng(32, [255, 99, 71]),
	});
	// 選んだ画像のプレビューが出る
	await expect(dialog.getByRole("img", { name: "Profile image" })).toHaveAttribute("src", /^blob:/);
	await dialog.getByRole("button", { name: "保存" }).click();
	await expect(notification(page, "更新に成功しました！")).toBeVisible();

	// 保存した画像はストレージの {userId}/ 配下に置かれる
	const avatar = page.getByRole("main").getByRole("img", { name: "プロフィール画像" });
	await expect(avatar).toHaveAttribute(
		"src",
		new RegExp(`/storage/v1/object/public/profile_image/${user.id}/\\d+\\.png$`),
	);
	await expect
		.poll(() => {
			return avatar.evaluate((img: HTMLImageElement) => img.naturalWidth);
		})
		.toBe(32);
});
