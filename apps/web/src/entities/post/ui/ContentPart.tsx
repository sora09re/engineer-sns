import { Box, Text } from "@mantine/core";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { CopyButton } from "@/shared/ui";

import type { ParsedContent } from "../lib/parseContent";

type ContentPartProps = {
	part: ParsedContent;
};

const COMPONENT_MAP = {
	code: SyntaxHighlighter,
	text: Text,
};

export const ContentPart: React.FC<ContentPartProps> = ({ part }) => {
	const Component = COMPONENT_MAP[part.type];
	const value = part.content.trim();

	if (part.type === "code") {
		return (
			<Box style={{ cursor: "auto", position: "relative" }}>
				<Box style={{ position: "absolute", right: 10, top: 10 }}>
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
