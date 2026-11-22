import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vite-plus/test";

import type { UserValues } from "@engineer-sns/shared";

import { UserValuesForm } from "./UserValuesForm";

beforeAll(() => {
	URL.createObjectURL = () => "blob:preview";
	URL.revokeObjectURL = () => {};
});

const blank: UserValues = {
	bio: "",
	email: "new@example.com",
	location: "",
	name: "新規 太郎",
	profile_image_url: "",
	username: "",
	website: "",
};

const setup = (props: { initialValues?: UserValues; withEmail?: boolean } = {}) => {
	const onSubmit = vi.fn();
	render(
		<MantineProvider>
			<UserValuesForm
				initialValues={props.initialValues ?? blank}
				withEmail={props.withEmail ?? true}
				submitLabel="送信"
				isSubmitting={false}
				onSubmit={onSubmit}
			/>
		</MantineProvider>,
	);
	return {
		onSubmit,
		submit: screen.getByRole("button", { name: "送信" }),
		user: userEvent.setup(),
	};
};

describe("UserValuesForm", () => {
	it("ルールを満たさない間は理由を表示して送信できず、満たすと送信できる", async () => {
		const { onSubmit, submit, user } = setup();
		expect(screen.getByRole("alert")).toHaveTextContent("ユーザーネームを入力してください。");
		expect(submit).toBeDisabled();

		await user.type(screen.getByLabelText(/ユーザーネーム/), "taro");
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		expect(submit).toBeEnabled();

		await user.click(submit);
		expect(onSubmit).toHaveBeenCalledWith({
			imageFile: null,
			values: { ...blank, username: "taro" },
		});
	});

	it("Enter で送るときも、ルールを満たさなければ送信しない", async () => {
		const { onSubmit, user } = setup();
		await user.type(screen.getByLabelText(/名前/), "{Enter}");
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("メールアドレスの欄を出さないときは、初期値のメールアドレスをそのまま送る", async () => {
		const { onSubmit, submit, user } = setup({
			initialValues: { ...blank, username: "taro" },
			withEmail: false,
		});
		expect(screen.queryByLabelText(/メールアドレス/)).not.toBeInTheDocument();

		await user.clear(screen.getByLabelText(/場所/));
		await user.type(screen.getByLabelText(/場所/), "Fukuoka");
		await user.click(submit);
		expect(onSubmit).toHaveBeenCalledWith({
			imageFile: null,
			values: { ...blank, username: "taro", location: "Fukuoka" },
		});
	});

	it("自己紹介はルールの文字数より長く入力できない", () => {
		setup();
		expect(screen.getByLabelText(/自己紹介/)).toHaveAttribute("maxLength", "160");
	});

	it("選んだ画像をプレビューし、送信に含める", async () => {
		const { onSubmit, user } = setup({ initialValues: { ...blank, username: "taro" } });
		const file = new File(["png"], "avatar.png", { type: "image/png" });

		await user.upload(document.querySelector<HTMLInputElement>('input[type="file"]')!, file);
		expect(await screen.findByRole("img", { name: "Profile image" })).toHaveAttribute(
			"src",
			"blob:preview",
		);

		await user.click(screen.getByRole("button", { name: "送信" }));
		expect(onSubmit).toHaveBeenCalledWith({
			imageFile: file,
			values: { ...blank, username: "taro" },
		});
	});
});
