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

const failure = (error: unknown, label: string) => {
	return {
		autoClose: 2000,
		color: "red",
		icon: <IconX size="1rem" />,
		message: error instanceof ApiError ? error.message : `${label}に失敗しました。`,
		title: "エラー",
	};
};

export const notifyMutation = async <V,>(
	mutation: Mutation<V>,
	variables: V,
	{ label, success = `${label}に成功しました！`, report = "all" }: MutationNotice,
): Promise<boolean> => {
	const result = mutation.mutateAsync(variables);
	if (report === "all") {
		notifications.promise(result, {
			loading: {
				message: "しばらくお待ちください。",
				title: `${label}中...`,
				withCloseButton: false,
			},
			success: {
				autoClose: 2000,
				color: "green",
				icon: <IconCheck size="1rem" />,
				message: success,
				title: "成功",
			},
			error: (error) => {
				return failure(error, label);
			},
		});
	}

	try {
		await result;
	} catch (error) {
		if (report === "failure") {
			notifications.show(failure(error, label));
		}
		return false;
	}
	return true;
};
