import { useSuspenseQuery } from "@tanstack/react-query";

import { currentUserQuery } from "../api/queries";
import type { LoginUser } from "@engineer-sns/shared";

export const useCurrentUser = (): LoginUser => {
	const { data } = useSuspenseQuery(currentUserQuery());
	if (!data) {
		throw new Error("ユーザーが見つかりません。");
	}
	return data;
};
