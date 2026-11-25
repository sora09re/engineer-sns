export type ParsedContent = {
	content: string;
	language?: string;
	offset: number;
	type: "text" | "code";
};

const fence = "```";

export const parseContent = (content: string): ParsedContent[] => {
	const parts = content.split(fence);
	let offset = 0;

	return parts.map((part, index) => {
		const partOffset = offset;
		offset += part.length + fence.length;

		let partContent = part;
		let language = "";
		if (index % 2 !== 0) {
			const match = part.match(/^([a-zA-Z0-9]+)\n/);
			if (match) {
				language = match[1];
				partContent = part.replace(match[0], "");
			}
		}

		return {
			content: partContent,
			language,
			offset: partOffset,
			type: index % 2 === 0 ? "text" : "code",
		};
	});
};
