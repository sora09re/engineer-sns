import { z } from "zod";

const uuid = z.guid();

export const isUuid = (value: string) => {
	return uuid.safeParse(value).success;
};
