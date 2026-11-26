import "@testing-library/jest-dom/vitest";
import { vi } from "vite-plus/test";

const forbidden = (name: string, instead: string) => {
	return new Proxy(
		{},
		{
			get: (_, property) => {
				if (property === "then") {
					return undefined;
				}
				const error = new Error(`テストから ${name} を使わない（docs/adr/0006）。${instead}`);
				queueMicrotask(() => {
					throw error;
				});
				throw error;
			},
		},
	);
};

vi.mock("@/shared/api/http", () => {
	return {
		api: forbidden(
			"shared/api/http.ts の api",
			"テストで vi.mock し、fetch を差し替えた Hono のクライアントを渡す。",
		),
	};
});

vi.mock("@/shared/api/supabase", () => {
	return { supabase: forbidden("shared/api/supabase.ts の supabase", "") };
});

if (typeof window !== "undefined") {
	window.matchMedia ??= (query: string) => {
		return {
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false,
		};
	};
	if (!("fonts" in document)) {
		Object.defineProperty(document, "fonts", {
			value: { addEventListener: () => {}, removeEventListener: () => {} },
		});
	}
}
