import { Box, Text } from "@mantine/core";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { CopyButton } from "@/components/CopyButton/CopyButton";

type ParsedContent = { content: string; type: "text" | "code" };

type ContentPartProps = {
  part: ParsedContent;
};

const COMPONENT_MAP = {
  code: SyntaxHighlighter,
  text: Text,
};

export const parseContent = (content: string): ParsedContent[] => {
  const parts = content.split("```");

  return parts.map((part, index) => {
    return {
      content: part,
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
          language="htmlbars"
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
