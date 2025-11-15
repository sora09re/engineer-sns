import { act, renderHook } from "@testing-library/react";
import { Provider } from "jotai";
// biome-ignore lint/style/useImportType:
import React from "react";
import { describe, expect, it } from "vitest";

import { useModal } from "../useModal";

// テスト用のラッパーコンポーネント
const wrapper = ({ children }: { children: React.ReactNode }) => (
	<Provider>{children}</Provider>
);

describe("useModal", () => {
	it("初期状態ではモーダルは非表示", () => {
		const { result } = renderHook(() => useModal("post"), { wrapper });
		const [isVisible] = result.current;

		expect(isVisible).toBe(false);
	});

	it("setIsVisibleを呼び出すとモーダルの表示状態が変更される", () => {
		const { result } = renderHook(() => useModal("post"), { wrapper });

		// 初期状態を確認
		expect(result.current[0]).toBe(false);

		// モーダルを表示に変更
		act(() => {
			result.current[1](true);
		});

		// 状態が更新されたことを確認
		expect(result.current[0]).toBe(true);

		// モーダルを非表示に変更
		act(() => {
			result.current[1](false);
		});

		// 状態が更新されたことを確認
		expect(result.current[0]).toBe(false);
	});

	it("異なるモーダルタイプは独立して状態を管理する", () => {
		const { result: postModalResult } = renderHook(() => useModal("post"), {
			wrapper,
		});
		const { result: editProfileModalResult } = renderHook(
			() => useModal("editProfile"),
			{ wrapper },
		);

		// 初期状態を確認
		expect(postModalResult.current[0]).toBe(false);
		expect(editProfileModalResult.current[0]).toBe(false);

		// postモーダルだけを表示に変更
		act(() => {
			postModalResult.current[1](true);
		});

		// postモーダルだけが表示されていることを確認
		expect(postModalResult.current[0]).toBe(true);
		expect(editProfileModalResult.current[0]).toBe(false);

		// editProfileモーダルも表示に変更
		act(() => {
			editProfileModalResult.current[1](true);
		});

		// 両方のモーダルが表示されていることを確認
		expect(postModalResult.current[0]).toBe(true);
		expect(editProfileModalResult.current[0]).toBe(true);
	});

	it("同じモーダルタイプを参照する複数のフックは独立した状態を持つ", () => {
		const { result: firstHook } = renderHook(() => useModal("post"), {
			wrapper,
		});
		const { result: secondHook } = renderHook(() => useModal("post"), {
			wrapper,
		});

		// 初期状態を確認
		expect(firstHook.current[0]).toBe(false);
		expect(secondHook.current[0]).toBe(false);

		// 一つ目のフックでモーダルを表示に変更
		act(() => {
			firstHook.current[1](true);
		});

		// 一つ目のフックだけが更新されていることを確認
		expect(firstHook.current[0]).toBe(true);
		expect(secondHook.current[0]).toBe(false);

		// 二つ目のフックでモーダルを表示に変更
		act(() => {
			secondHook.current[1](true);
		});

		// 両方のフックが表示状態になっていることを確認
		expect(firstHook.current[0]).toBe(true);
		expect(secondHook.current[0]).toBe(true);

		// 二つ目のフックでモーダルを非表示に変更
		act(() => {
			secondHook.current[1](false);
		});

		// 二つ目のフックだけが非表示になっていることを確認
		expect(firstHook.current[0]).toBe(true);
		expect(secondHook.current[0]).toBe(false);
	});
});
