import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { NewPostForm } from "./NewPostForm";

vi.mock("@/shared/api/supabase", () => {
	return { supabase: { auth: { getSession: async () => ({ data: { session: null } }) } } };
});

const requests: { path: string; body: unknown }[] = [];
let status = 201;

beforeEach(() => {
	requests.length = 0;
	status = 201;
	vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
		const request = new Request(input, init);
		requests.push({ path: new URL(request.url).pathname, body: await request.json() });
		return new Response(JSON.stringify({}), {
			status,
			headers: { "Content-Type": "application/json" },
		});
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

const setup = (props: Parameters<typeof NewPostForm>[0]) => {
	const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
	render(
		<MantineProvider>
			<QueryClientProvider client={queryClient}>
				<NewPostForm {...props} />
			</QueryClientProvider>
		</MantineProvider>,
	);
	return { user: userEvent.setup() };
};

describe("NewPostForm", () => {
	it("親投稿がなければ、本文を投稿として送り、送れたら空にする", async () => {
		const onPosted = vi.fn();
		const { user } = setup({ onPosted });

		await user.type(screen.getByPlaceholderText("今どうしてる？"), "こんにちは");
		await user.click(screen.getByRole("button", { name: "投稿する" }));

		await waitFor(() => expect(onPosted).toHaveBeenCalledOnce());
		expect(requests).toEqual([{ path: "/api/posts", body: { content: "こんにちは" } }]);
		expect(screen.getByPlaceholderText("今どうしてる？")).toHaveValue("");
	});

	it("親投稿があれば、本文をその投稿へのコメントとして送る", async () => {
		const onPosted = vi.fn();
		const { user } = setup({ parentPostId: "parent-id", onPosted });

		await user.type(screen.getByPlaceholderText("コメント"), "いいですね");
		await user.click(screen.getByRole("button", { name: "コメントする" }));

		await waitFor(() => expect(onPosted).toHaveBeenCalledOnce());
		expect(requests).toEqual([
			{ path: "/api/posts/parent-id/comments", body: { content: "いいですね" } },
		]);
		expect(screen.getByPlaceholderText("コメント")).toHaveValue("");
	});

	it("本文が空白だけのあいだは送れない", async () => {
		const { user } = setup({ parentPostId: "parent-id" });
		const button = screen.getByRole("button", { name: "コメントする" });

		expect(button).toBeDisabled();
		await user.type(screen.getByPlaceholderText("コメント"), "  \n ");
		expect(button).toBeDisabled();
		await user.type(screen.getByPlaceholderText("コメント"), "a");
		expect(button).toBeEnabled();
	});

	it("送れなかったら本文を残す", async () => {
		status = 500;
		const onPosted = vi.fn();
		const { user } = setup({ onPosted });

		await user.type(screen.getByPlaceholderText("今どうしてる？"), "残る本文");
		await user.click(screen.getByRole("button", { name: "投稿する" }));

		await waitFor(() => expect(requests).toHaveLength(1));
		await waitFor(() => expect(screen.getByRole("button", { name: "投稿する" })).toBeEnabled());
		expect(onPosted).not.toHaveBeenCalled();
		expect(screen.getByPlaceholderText("今どうしてる？")).toHaveValue("残る本文");
	});
});
