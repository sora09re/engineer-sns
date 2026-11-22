import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";

import type { LoginUser } from "@engineer-sns/shared";

import { EditProfileModal } from "./EditProfileModal";

vi.mock("@/shared/api", () => {
	return {};
});
vi.mock("../api/useUpdateCurrentUser", () => {
	return {
		useUpdateCurrentUser: () => {
			return { isPending: false, mutate: vi.fn() };
		},
	};
});

const alice: LoginUser = {
	id: "00000000-0000-0000-0000-000000000001",
	bio: "",
	created_at: "2026-01-01T00:00:00Z",
	email: "alice@example.com",
	name: "Alice",
	updated_at: "2026-01-01T00:00:00Z",
	username: "alice",
};

const ui = (opened: boolean) => {
	return (
		<MantineProvider>
			<EditProfileModal currentUser={alice} opened={opened} onClose={() => {}} />
		</MantineProvider>
	);
};

describe("EditProfileModal", () => {
	it("保存せずに閉じると、閉じ終わる前に開き直しても入力を捨ててログイン中のユーザーの値から始める", async () => {
		const user = userEvent.setup();
		const { rerender } = render(ui(true));
		const name = await screen.findByLabelText(/名前/);
		await user.clear(name);
		await user.type(name, "下書き");

		rerender(ui(false));
		rerender(ui(true));

		expect(await screen.findByLabelText(/名前/)).toHaveValue("Alice");
	});
});
