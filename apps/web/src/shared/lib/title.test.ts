import { describe, expect, it } from "vite-plus/test";

import { pageTitle } from "./title";

describe("pageTitle", () => {
	it("ページの名前のあとにサービス名を付けた title を返す", () => {
		expect(pageTitle("ホーム")).toEqual({ meta: [{ title: "ホーム | Engineer-SNS" }] });
	});
});
