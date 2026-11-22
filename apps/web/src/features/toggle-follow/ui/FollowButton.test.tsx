import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";

import { FollowButton } from "./FollowButton";

vi.mock("@/shared/api", () => {
	return {};
});
vi.mock("../api/useToggleFollow", () => {
	return {
		useToggleFollow: () => {
			return { isPending: false };
		},
	};
});

const ui = (user: { is_following: boolean; can_follow: boolean }) => {
	return (
		<MantineProvider>
			<FollowButton user={{ id: "00000000-0000-0000-0000-000000000001", ...user }} />
		</MantineProvider>
	);
};

describe("FollowButton", () => {
	it("フォローしていなければ、取り直しを待たずに「フォロー」を押せる", () => {
		render(ui({ is_following: false, can_follow: true }));

		expect(screen.getByRole("button", { name: "フォロー" })).toBeEnabled();
	});

	it("フォローしていれば「フォロー中」を出す", () => {
		render(ui({ is_following: true, can_follow: true }));

		expect(screen.getByRole("button", { name: "フォロー中" })).toBeVisible();
	});

	it("フォローできない相手には、ボタンを出さない", () => {
		render(ui({ is_following: false, can_follow: false }));

		expect(screen.queryByRole("button")).toBeNull();
	});
});
