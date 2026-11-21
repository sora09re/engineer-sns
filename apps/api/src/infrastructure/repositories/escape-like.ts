export const escapeLike = (value: string) => {
	return value.replace(/[\\%_]/g, (char) => `\\${char}`);
};
