export type ParsedContent = {
	content: string;
	language?: string;
	offset: number;
	type: "text" | "code";
};

const fence = "```";

export const parseContent = (content: string): ParsedContent[] => {
	const parts = content.split(fence);
	let currentLanguage = "";
	let offset = 0;

	return parts.map((part, index) => {
		const partOffset = offset;
		offset += part.length + fence.length;

		let partContent = part;
		if (index % 2 !== 0) {
			const match = part.match(/^([a-zA-Z0-9]+)\n/);
			if (match) {
				currentLanguage = match[1];
				partContent = part.replace(match[0], "");
			}
		}

		return {
			content: partContent,
			language: currentLanguage,
			offset: partOffset,
			type: index % 2 === 0 ? "text" : "code",
		};
	});
};
