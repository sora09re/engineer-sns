import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { ApiError } from "../api/response";

export interface MutationNotice {
	label: string;
	success?: string;
	report?: "all" | "failure";
}

interface Mutation<V> {
	mutateAsync: (variables: V) => Promise<unknown>;
}

let lastId = 0;

const failureMessage = (error: unknown, label: string) => {
	return error instanceof ApiError ? error.message : `${label}に失敗しました。`;
};

export const notifyMutation = async <V,>(
	mutation: Mutation<V>,
	variables: V,
	{ label, success = `${label}に成功しました！`, report = "all" }: MutationNotice,
): Promise<boolean> => {
	lastId += 1;
	const id = `mutation-${lastId}`;
	if (report === "all") {
		notifications.show({
			id,
			autoClose: false,
			loading: true,
			message: "しばらくお待ちください。",
			title: `${label}中...`,
			withCloseButton: false,
		});
	}

	try {
		await mutation.mutateAsync(variables);
	} catch (error) {
		const notice = {
			id,
			autoClose: 2000,
			color: "red",
			icon: <IconX size="1rem" />,
			message: failureMessage(error, label),
			title: "エラー",
		};
		if (report === "all") {
			notifications.update(notice);
		} else {
			notifications.show(notice);
		}
		return false;
	}

	if (report === "all") {
		notifications.update({
			id,
			autoClose: 2000,
			color: "green",
			icon: <IconCheck size="1rem" />,
			message: success,
			title: "成功",
		});
	}
	return true;
};
