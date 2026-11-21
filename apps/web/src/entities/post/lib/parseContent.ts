export type ParsedContent = {
	content: string;
	language?: string;
	type: "text" | "code";
};

export const parseContent = (content: string): ParsedContent[] => {
	const parts = content.split("```");
	let currentLanguage = "";

	return parts.map((part, index) => {
		let content = part;
		if (index % 2 !== 0) {
			const match = part.match(/^([a-zA-Z0-9]+)\n/);
			if (match) {
				currentLanguage = match[1];
				content = part.replace(match[0], "");
			}
		}

		return {
			content,
			language: currentLanguage,
			type: index % 2 === 0 ? "text" : "code",
		};
	});
};
