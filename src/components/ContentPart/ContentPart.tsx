import { Box, Text } from "@mantine/core";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { CopyButton } from "@/components/CopyButton/CopyButton";

type ParsedContent = {
	content: string;
	language?: string;
	type: "text" | "code"; // 追加: コードブロックの言語
};

type ContentPartProps = {
	part: ParsedContent;
};

const COMPONENT_MAP = {
	code: SyntaxHighlighter,
	text: Text,
};

export const parseContent = (content: string): ParsedContent[] => {
	const parts = content.split("```");
	let currentLanguage = "";

	return parts.map((part, index) => {
		if (index % 2 !== 0) {
			const match = part.match(/^([a-zA-Z0-9]+)\n/);
			let updatedPart = part;
			if (match) {
				currentLanguage = match[1];
				updatedPart = updatedPart.replace(match[0], "");
			}
		}

		return {
			content: part,
			language: currentLanguage,
			type: index % 2 === 0 ? "text" : "code",
		};
	});
};

export const ContentPart: React.FC<ContentPartProps> = ({ part }) => {
	const Component = COMPONENT_MAP[part.type];
	const value = part.content.trim();

	if (part.type === "code") {
		return (
			<Box sx={{ cursor: "auto", position: "relative" }}>
				<Box sx={{ position: "absolute", right: 10, top: 10 }}>
					<CopyButton value={value} />
				</Box>
				<Component
					language={part.language || "htmlbars"} // 更新: 言語を動的に設定
					style={monokaiSublime}
					onClick={(event) => {
						event.stopPropagation();
					}}
				>
					{value}
				</Component>
			</Box>
		);
	}

	return <Component>{value}</Component>;
};
