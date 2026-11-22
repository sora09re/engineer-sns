import "@testing-library/jest-dom/vitest";

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
