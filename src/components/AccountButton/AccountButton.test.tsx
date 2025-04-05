import { mockUser } from "@/components/AccountButton/AccountButton.stories";
import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { useSession } from "next-auth/react";
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from "vitest";
import type { Mock } from "vitest";
import { AccountButton } from "./AccountButton";

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());

vi.mock("next-auth/react", () => ({
	useSession: vi.fn(),
}));
const useSessionMock = useSession as unknown as Mock;

describe("AccountButton", () => {
	const { currentUser } = mockUser;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test.concurrent(
		"セッションが存在する場合、ユーザー情報が表示される",
		server.boundary(() => {
			useSessionMock.mockReturnValue({
				data: { user: currentUser },
			});

			render(<AccountButton currentUser={currentUser} />);

			expect(screen.getByText(currentUser.name)).toBeInTheDocument();
			expect(screen.getByText(`@${currentUser.username}`)).toBeInTheDocument();
			const avatar = screen.getByRole("img");
			expect(avatar).toHaveAttribute("src", currentUser.profile_image_url);
		}),
	);

	test.concurrent(
		"セッションが存在しない場合、何もレンダリングされない",
		server.boundary(() => {
			useSessionMock.mockReturnValue({
				data: null,
			});

			const { container } = render(<AccountButton currentUser={currentUser} />);
			// コンポーネントが空の場合、container.firstChild は null となる
			expect(container.firstChild).toBeNull();
		}),
	);
});
