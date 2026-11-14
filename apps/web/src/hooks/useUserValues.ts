import { useState } from "react";

import type { UserValues } from "@engineer-sns/shared";

/** プロフィール入力フォームの状態 */
export const useUserValues = (initialValues: UserValues) => {
	const [values, setValues] = useState<UserValues>(initialValues);

	const updateValues = (newValues: Partial<UserValues>) => {
		setValues((prev) => {
			return { ...prev, ...newValues };
		});
	};

	return { updateValues, values };
};
