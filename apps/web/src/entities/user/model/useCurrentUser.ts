import { useSuspenseQuery } from "@tanstack/react-query";

import { currentUserQuery } from "../api/queries";
import type { User } from "@engineer-sns/shared";

export const useCurrentUser = (): User => {
	const { data } = useSuspenseQuery(currentUserQuery());
	if (!data) {
		throw new Error("ユーザーが見つかりません。");
	}
	return data;
};
