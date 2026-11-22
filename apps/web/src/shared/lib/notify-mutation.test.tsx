import { MantineProvider } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vite-plus/test";

import { ApiError } from "../api/response";
import { notifyMutation } from "./notify-mutation";

const deferred = () => {
	let resolve!: () => void;
	let reject!: (error: unknown) => void;
	const promise = new Promise<void>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, reject, resolve };
};

const mutationOf = (result: Promise<void>) => {
	const calls: string[] = [];
	return {
		calls,
		mutation: {
			mutateAsync: (variables: string) => {
				calls.push(variables);
				return result;
			},
		},
	};
};

const notice = (text: string) => {
	return screen.findByText(text);
};

beforeAll(() => {
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
});

const setup = () => {
	render(
		<MantineProvider>
			<Notifications />
		</MantineProvider>,
	);
};

afterEach(() => {
	act(() => {
		notifications.clean();
	});
});

describe("notifyMutation", () => {
	it("mutateAsync に値を渡し、送信中から成功に変えて true を返す", async () => {
		setup();
		const { promise, resolve } = deferred();
		const { calls, mutation } = mutationOf(promise);

		let result: Promise<boolean> | undefined;
		act(() => {
			result = notifyMutation(mutation, "本文", { label: "投稿" });
		});
		expect(calls).toEqual(["本文"]);
		expect(await notice("投稿中...")).toBeInTheDocument();

		await act(async () => {
			resolve();
			await result;
		});
		expect(await result).toBe(true);
		expect(await notice("投稿に成功しました！")).toBeInTheDocument();
		expect(screen.queryByText("投稿中...")).not.toBeInTheDocument();
	});

	it("成功の文言を差し替えられる", async () => {
		setup();
		const { mutation } = mutationOf(Promise.resolve());

		await act(async () => {
			await notifyMutation(mutation, "id", { label: "削除", success: "削除しました。" });
		});
		expect(await notice("削除しました。")).toBeInTheDocument();
	});

	it("API が返した message で失敗を知らせ、false を返す", async () => {
		setup();
		const { mutation } = mutationOf(
			Promise.reject(new ApiError(409, "そのユーザー名はすでに使われています。")),
		);

		let result = true;
		await act(async () => {
			result = await notifyMutation(mutation, "値", { label: "更新" });
		});
		expect(result).toBe(false);
		expect(await notice("そのユーザー名はすでに使われています。")).toBeInTheDocument();
		expect(screen.queryByText("更新中...")).not.toBeInTheDocument();
	});

	it("API の message がない失敗は「{label}に失敗しました。」にする", async () => {
		setup();
		const { mutation } = mutationOf(Promise.reject(new TypeError("Failed to fetch")));

		await act(async () => {
			await notifyMutation(mutation, "値", { label: "コメント" });
		});
		expect(await notice("コメントに失敗しました。")).toBeInTheDocument();
		expect(screen.queryByText("Failed to fetch")).not.toBeInTheDocument();
	});

	it("report が failure なら、成功は知らせない", async () => {
		setup();
		const { mutation } = mutationOf(Promise.resolve());

		let result = false;
		await act(async () => {
			result = await notifyMutation(mutation, "値", { label: "いいね", report: "failure" });
		});
		expect(result).toBe(true);
		expect(screen.queryByText("いいね中...")).not.toBeInTheDocument();
		expect(screen.queryByText("いいねに成功しました！")).not.toBeInTheDocument();
	});

	it("report が failure でも、失敗は知らせる", async () => {
		setup();
		const { mutation } = mutationOf(
			Promise.reject(new ApiError(403, "先にユーザー登録をしてください。")),
		);

		await act(async () => {
			await notifyMutation(mutation, "値", { label: "フォロー", report: "failure" });
		});
		expect(await notice("先にユーザー登録をしてください。")).toBeInTheDocument();
	});
});
