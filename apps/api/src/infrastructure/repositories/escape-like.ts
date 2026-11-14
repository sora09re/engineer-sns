/** LIKE のパターンで特別な意味を持つ文字（\ % _）を、文字そのものとして一致させる */
export const escapeLike = (value: string) => {
	return value.replace(/[\\%_]/g, (char) => `\\${char}`);
};
