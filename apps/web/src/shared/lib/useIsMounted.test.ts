import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { useIsMounted } from "./useIsMounted";

describe("useIsMounted", () => {
	it("表示中は true を返し、外れたあとは false を返す", () => {
		const { result, unmount } = renderHook(() => {
			return useIsMounted();
		});
		const isMounted = result.current;

		expect(isMounted()).toBe(true);
		unmount();
		expect(isMounted()).toBe(false);
	});
});
