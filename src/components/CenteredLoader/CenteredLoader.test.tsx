import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";
import { CenteredLoader } from "./CenteredLoader";

describe("CenteredLoader", () => {
	test("100vh の高さでセンタリングされたローダーがレンダリングされる", () => {
		const { container } = render(<CenteredLoader />);

		const centerElement = container.firstChild;
		expect(centerElement).toHaveStyle("height: 100vh");

		const loaderSvg = container.querySelector("svg");
		expect(loaderSvg).toBeInTheDocument();
	});
});
